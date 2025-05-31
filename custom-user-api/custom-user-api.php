<?php
/**
 * Plugin Name: Custom User API with WooCommerce Plan
 * Description: Exposes custom REST API endpoints for user login and a unified profile endpoint that includes user data, authentication status, and WooCommerce membership plans.
 * Version: 1.4
 * Author: Shahbaz
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Register REST API routes
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/login', [
        'methods'             => 'POST',
        'callback'            => 'custom_api_login',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom/v1', '/profile', [
        'methods'             => 'GET',
        'callback'            => 'custom_api_get_profile',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * User login endpoint - returns token
 */
function custom_api_login(WP_REST_Request $request) {
    $username = $request->get_param('username');
    $password = $request->get_param('password');

    $user = wp_signon([
        'user_login'    => $username,
        'user_password' => $password,
        'remember'      => false,
    ], false);

    if ( is_wp_error($user) ) {
        return new WP_Error('invalid_credentials', 'Invalid username or password', ['status' => 403]);
    }

    // Generate and store token
    $token = bin2hex(random_bytes(16));
    update_user_meta($user->ID, '_api_token', $token);

    return [
        'token' => $token,
        'user_id' => $user->ID,
    ];
}

/**
 * Profile endpoint - returns user info and memberships (based on Bearer token)
 */
function custom_api_get_profile(WP_REST_Request $request) {
    $user = custom_api_authenticate_token($request);
    if ( is_wp_error($user) ) {
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

    // Membership data
    if ( function_exists('wc_memberships_get_user_memberships') ) {
        $memberships = wc_memberships_get_user_memberships($user->ID);
        $plans = [];

        foreach ( $memberships as $membership ) {
            $plan = $membership->get_plan();
            $plans[] = [
                'membership_id' => $membership->get_id(),
                'plan_id'       => $plan->get_id(),
                'plan_name'     => $plan->get_name(),
                'plan_slug'     => $plan->get_slug(),
                'start_date'    => $membership->get_start_date('Y-m-d'),
                'end_date'      => $membership->get_end_date('Y-m-d'),
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
 * Token-based authentication
 */
function custom_api_authenticate_token(WP_REST_Request $request) {
    $auth = $request->get_header('Authorization');

    if ( ! $auth || stripos($auth, 'Bearer ') !== 0 ) {
        return new WP_Error('no_token', 'No Bearer token provided', ['status' => 401]);
    }

    $token = substr($auth, 7);
    $query = new WP_User_Query([
        'meta_key'   => '_api_token',
        'meta_value' => $token,
        'number'     => 1,
    ]);

    $users = $query->get_results();

    if ( empty($users) ) {
        return new WP_Error('invalid_token', 'Invalid token', ['status' => 403]);
    }

    return $users[0];
}
