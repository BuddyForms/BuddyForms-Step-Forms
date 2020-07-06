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
			'id'       => 'step1',
			'children' => $form_elements
		);
		echo json_encode( $result );
		die();
	}


	$new_form_elements = $buddyforms[ $form_slug ]['form_fields'];




	foreach ( $step_forms[ $form_slug ] as $key => $step_form ) {

		$step_form = get_object_vars( $step_form );

		$result[] = array(
			'name'     => $step_form['name'],
			'id'       => $step_form['id'],
			'children' => $step_form['children']
		);

		foreach ( $step_form['children'] as $field_id => $child ) {
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

	$steps_forms[ $form_slug ] = json_decode( $json );

	update_option( 'buddyforms_step_forms', $steps_forms );

}