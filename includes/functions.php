<?php

add_action( 'wp_ajax_buddyforms_step_forms_get_steps', 'buddyforms_step_forms_get_steps' );
function buddyforms_step_forms_get_steps() {
	global $buddyforms;

	$form_slug = $_POST['form_slug'];

	$step_forms = get_option( 'buddyforms_step_forms', true );


	if ( ! isset( $step_forms[ $form_slug ] ) ) {

		foreach ( $buddyforms[ $form_slug ]['form_fields'] as $key => $form_field ) {
			$form_elements[] = array(
				'id'   => $key,
				'name' => $form_field['name'],
			);
		}
		$result[] = array(
			'name'     => 'Step 1',
			'id'       => 1,
			'children' => $form_elements
		);
		echo json_encode( $result );
		die();
	}


	$new_form_elements = $buddyforms[ $form_slug ]['form_fields'];

	$steps = $step_forms[ $form_slug ][ 'steps' ];

	foreach ( $steps as $key => $step ) {

		$step = get_object_vars( $step );

		$result[] = array(
			'name'     => $step['name'],
			'id'       => $step['id'],
			'children' => isset($step['children']) ? $step['children'] : []
		);

		foreach ( $step['children'] as $field_id => $child ) {
			$child = get_object_vars( $child );
			unset( $new_form_elements[ $child['id'] ] );
		}

	}

	foreach ( $new_form_elements as $filed_id => $new_form_element ) {

		$field = $buddyforms[ $form_slug ]['form_fields'][$filed_id];
		$result[0]['children'][] = array(
			'id'   => $filed_id,
			'name' => $field['name'],
		);
	}

	echo json_encode( $result );
	die();
}


add_action( 'wp_ajax_buddyforms_step_forms_save_step', 'buddyforms_step_forms_save_step' );
function buddyforms_step_forms_save_step() {
	global $buddyforms;

	$form_slug = $_POST['form_slug'];
	$json      = $_POST['json'];

	$json = str_replace( '\\', "", $json );
	$steps_forms = get_option('buddyforms_step_forms');

	if ( !is_array( $steps_forms ) ) {
		$steps_forms = array();
	}

	$steps_forms[ $form_slug ] = array(
		'shortcode' => '[buddyforms_step_form form_slug="'. $form_slug . '"]',
		'steps' => json_decode( $json )
	);

	update_option( 'buddyforms_step_forms', $steps_forms );

	echo json_encode( $steps_forms );
	die();
}