<?php
/**
 * Plugin Name: Custom User API with WooCommerce Plan & CORS
 * Description: Exposes custom REST API endpoints for user login and profile, with CORS support for app.hubinterview.com and app.hubinterview.org.  Requires an active WooCommerce membership to log in.
 * Version:     1.5
 * Author:      Shahbaz
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Utility: get and validate Origin header against whitelist.
 *
 * @return string|false Returns the valid origin, or false if not allowed.
 */
function custom_cors_get_allowed_origin() {
    if ( empty( $_SERVER['HTTP_ORIGIN'] ) ) {
        return false;
    }

    // Define your allowed origins here
    $allowed = [
        'https://app.hubinterview.com',
        'https://app.hubinterview.org',
    ];

    $origin = esc_url_raw( $_SERVER['HTTP_ORIGIN'] );
    if ( in_array( $origin, $allowed, true ) ) {
        return $origin;
    }

    return false;
}

// 1️⃣ Early OPTIONS preflight handler — fires before WP routing
add_action( 'init', function() {
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
        $origin = custom_cors_get_allowed_origin();
        if ( $origin ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
            header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce' );
            header( 'Access-Control-Allow-Credentials: true' );
        }
        // Always exit on OPTIONS
        exit(0);
    }
}, 0 );

// 2️⃣ Register REST routes and inject CORS on every REST response
add_action( 'rest_api_init', function () {
    // Login endpoint
    register_rest_route( 'custom/v1', '/login', [
        'methods'             => 'POST',
        'callback'            => 'custom_api_login',
        'permission_callback' => '__return_true',
    ] );

    // Profile endpoint
    register_rest_route( 'custom/v1', '/profile', [
        'methods'             => 'GET',
        'callback'            => 'custom_api_get_profile',
        'permission_callback' => '__return_true',
    ] );

    // Remove WP core CORS headers, then add ours
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function( $served, $result, $request, $server ) {
        $origin = custom_cors_get_allowed_origin();
        if ( $origin ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
            header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce' );
            header( 'Access-Control-Allow-Credentials: true' );
        }
        return $served;
    }, 10, 4 );

} );

/**
 * User login endpoint - returns token only if user has an active membership
 */
function custom_api_login( WP_REST_Request $request ) {
    $username = $request->get_param( 'username' );
    $password = $request->get_param( 'password' );

    // 1. Authenticate credentials
    $user = wp_signon( [
        'user_login'    => $username,
        'user_password' => $password,
        'remember'      => false,
    ], false );

    if ( is_wp_error( $user ) ) {
        return new WP_Error( 'invalid_credentials', 'Invalid username or password', [ 'status' => 403 ] );
    }

    // 2. Require active WooCommerce membership
    if ( function_exists( 'wc_memberships_get_user_memberships' ) ) {
        $memberships = wc_memberships_get_user_memberships( $user->ID );
        $has_active = false;

        foreach ( $memberships as $membership ) {
            if ( 'active' === $membership->get_status() ) {
                $has_active = true;
                break;
            }
        }

        if ( ! $has_active ) {
            return new WP_Error(
                'no_active_membership',
                'You must have an active subscription to log in.',
                [ 'status' => 403 ]
            );
        }
    } else {
        // If memberships plugin isn’t present, optionally block or allow
        return new WP_Error(
            'memberships_missing',
            'Membership system unavailable. Please contact support.',
            [ 'status' => 503 ]
        );
    }

    // 3. Generate and store token
    $token = bin2hex( random_bytes(16) );
    update_user_meta( $user->ID, '_api_token', $token );

    return [
        'token'   => $token,
        'user_id' => $user->ID,
    ];
}

/**
 * Profile endpoint - returns user info and memberships (based on Bearer token)
 */
function custom_api_get_profile( WP_REST_Request $request ) {
    $user = custom_api_authenticate_token( $request );
    if ( is_wp_error( $user ) ) {
        return $user;
    }

    $data = [
        'id'        => $user->ID,
        'username'  => $user->user_login,
        'email'     => $user->user_email,
        'name'      => $user->display_name,
        'roles'     => $user->roles,
        'logged_in' => true,
    ];

    // WooCommerce Memberships data
    if ( function_exists( 'wc_memberships_get_user_memberships' ) ) {
        $memberships = wc_memberships_get_user_memberships( $user->ID );
        $plans = [];

        foreach ( $memberships as $membership ) {
            $plan = $membership->get_plan();
            $plans[] = [
                'membership_id' => $membership->get_id(),
                'plan_id'       => $plan->get_id(),
                'plan_name'     => $plan->get_name(),
                'plan_slug'     => $plan->get_slug(),
                'start_date'    => $membership->get_start_date( 'Y-m-d' ),
                'end_date'      => $membership->get_end_date( 'Y-m-d' ),
                'status'        => $membership->get_status(),
            ];
        }

        $data['plans'] = $plans;
    } else {
        $data['plans'] = [];
    }

    return $data;
}

/**
 * Token-based authentication helper
 */
function custom_api_authenticate_token( WP_REST_Request $request ) {
    $auth = $request->get_header( 'Authorization' );
    if ( ! $auth || stripos( $auth, 'Bearer ' ) !== 0 ) {
        return new WP_Error( 'no_token', 'No Bearer token provided', [ 'status' => 401 ] );
    }

    $token = substr( $auth, 7 );
    $query = new WP_User_Query( [
        'meta_key'   => '_api_token',
        'meta_value' => $token,
        'number'     => 1,
    ] );

    $users = $query->get_results();
    if ( empty( $users ) ) {
        return new WP_Error( 'invalid_token', 'Invalid token', [ 'status' => 403 ] );
    }

    return $users[0];
}
