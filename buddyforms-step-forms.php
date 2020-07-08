<?php
/*
 * Plugin Name: BuddyForms Step Forms
 * Plugin URI: https://themekraft.com/products/step-forms/
 * Description: Create beautiful step forms with triggers to continue editing and or fire anny action. Works with WooCommerce, BuddyPress, Ultimate Member and LearnDash
 * Version: 0.0.1
 * Author: ThemeKraft
 * Author URI: https://themekraft.com/buddyforms/
 * License: GPLv2 or later
 * Network: false
 * Text Domain: buddyforms-step-forms
 * Domain Path: /languages

 *
 *****************************************************************************
 *
 * This script is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 ****************************************************************************
 */

add_action( 'init', 'buddyforms_step_forms_includes', 10 );
function buddyforms_step_forms_includes() {
	include_once( dirname( __FILE__ ) . '/includes/form/form-elements-front.php' );

	define( 'BUDDYFORMS_STEP_FORMS_ASSETS', plugins_url( 'assets/', __FILE__ ) );
	define( 'BUDDYFORMS_STEP_FORMS_VERSION', '0.0.1' );

	// Only Check for requirements in the admin
	if ( ! is_admin() ) {
		return;
	}
	include_once( dirname( __FILE__ ) . '/includes/functions.php' );


	include_once( dirname( __FILE__ ) . '/includes/form/form-builder-elements.php' );
	include_once( dirname( __FILE__ ) . '/includes/form/step-forms-creator.php' );

	add_action( 'plugins_loaded', 'buddyforms_step_forms_load_plugin_textdomain' );
}

/**
 * Load the textdomain for the plugin
 */
function buddyforms_step_forms_load_plugin_textdomain() {
	load_plugin_textdomain( 'buddyforms-step-forms', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

// function to enqueue stylesheets and scripts

function buddyforms_step_forms_scripts() {

	wp_enqueue_style( 'tree-css', BUDDYFORMS_STEP_FORMS_ASSETS . '/resources/jqtree/jqtree.css' );
	// wp_enqueue_style( 'step-forms.css', BUDDYFORMS_STEP_FORMS_ASSETS . '/css/buddyforms.step.forms.css' );

	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'jquery-ui-core' );
	wp_enqueue_script( 'jquery-ui-tabs' );
	wp_enqueue_script( 'jquery-ui-dialog' );



	wp_enqueue_style( 'wp-jquery-ui' );
	wp_enqueue_style( 'wp-jquery-ui-tabs' );
	wp_enqueue_style( 'wp-jquery-ui-dialog' );

	wp_register_script( 'tree-js', BUDDYFORMS_STEP_FORMS_ASSETS . '/resources/jqtree/tree.jquery.js' , array( 'jquery' ) );
	wp_enqueue_script( 'tree-js' );

	wp_register_script( 'step-forms-js', BUDDYFORMS_STEP_FORMS_ASSETS . '/js/buddyforms.step.forms.js' , array( 'jquery' ) );
	wp_enqueue_script( 'step-forms-js' );

}

add_action( 'admin_enqueue_scripts', 'buddyforms_step_forms_scripts' );