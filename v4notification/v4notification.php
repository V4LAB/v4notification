<?php
/**
 * @package v4Notification
 * @version 0.0.1
 */
/*
Plugin Name: v4Notification
Plugin URI: 
Description: V4 Notification allows your users to receive notification when you post something.
Author: ItsValentin
Version: 0.0.1
Author URI: https://itsvalentin.com
*/

global $wpdb;

add_filter( 'init', function( $template ) {
    if ( isset( $_GET['vlab_json_notification'] ) ) {
    	$vlab_json = 'yes';
        include plugin_dir_path( __FILE__ ) . 'vlab_json.php';
        die;
    }
});