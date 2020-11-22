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
ERROR_REPORTING(E_ALL);

global $wpdb;
$posts = $wpdb->get_results("SELECT id,post_title, guid FROM ".$wpdb->prefix."posts WHERE post_type = 'post' AND post_status = 'publish' ORDER BY id DESC LIMIT 1");
if(empty($posts)){
	return;
}

$thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id($posts[0]->id), 'post');
if(!empty($thumbnail)){
	$thumbnail = (!empty($thumbnail[0]) ? $thumbnail[0] : '');
}
$content = apply_filters('the_content', get_post_field('post_content', $posts[0]->id));
$content = strip_tags($content);
$content = str_replace("\n","",$content);

if (strlen($content) > 50){
   $content = mb_substr($content, 0, 47) . '...';
}

$last_post = array(
	'id' => (int)$posts[0]->id,
	'title' => esc_attr($posts[0]->post_title),
	'url' => esc_url($posts[0]->guid),
	'icon' => get_site_icon_url(),
	'thumbnail' => esc_attr($thumbnail),
	'content' => $content,
);

if(empty($last_post)){
	return;
}

header('Content-Type: application/json');
echo json_encode($last_post);