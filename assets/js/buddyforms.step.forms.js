jQuery(document).ready(function (jQuery) {

    //
    // Create the tabs
    //
    jQuery("#buddyforms-step-forms-tabs").tabs();


    //
    // Switch the Tabs with a select
    //
    jQuery(document.body).on('change', '#step-forms-form-select', function () {
        form_slug = jQuery("#step-forms-form-select").val();
        jQuery('#buddyforms-step-forms-tabs a[href="#tab' + form_slug + '"]')[0].click()
    });


    //
    // Create a New Step
    //
    jQuery(document.body).on('click', '.buddyforms-step-forms-create-step', function () {
        $form_slug = jQuery(this).attr('data-slug');


        var tree_data = jQuery('#step-' + $form_slug).tree('getTree');

        var node1 = tree_data.children.slice(-1)[0];

        var count = tree_data.children.length + 1

        jQuery('#step-' + $form_slug).tree(
            'addNodeAfter',
            {
                name: 'Step ',
                id: count,
                children: []
            },
            node1
        );
    });


    //
    // Save the step form
    //
    jQuery(document.body).on('click', '.buddyforms-step-forms-save', function () {

        $form_slug = jQuery(this).attr('data-slug');


        var tree_data = jQuery('#step-' + $form_slug).tree('getTree');

        json = jQuery('#step-' + $form_slug).tree('toJson');


        // var node1 = jQuery('#step-' + $form_slug).tree('getNodeByName', 'contact');

        console.log(json);


        /*  jQuery('#step-' + $form_slug).tree(
              'addParentNode',
              {
                  name: 'new_parent',
                  id: 456
              },
              node1
          );*/


        jQuery.ajax({

            url: buddyformsGlobal.admin_url,
            type: 'POST',
            dataType: 'json',
            dragAndDrop: true,
            tabIndex: 1,
            data: {
                "action": "buddyforms_step_forms_save_step",
                "form_slug": $form_slug,
                "json": json
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
            success: function (response) {
                console.log(response);

                alert('Steps Saved')
            }

        });
    });

});


//
// get the step form json
//
function buddyforms_get_step($form_slug) {

    jQuery.ajax({

        url: buddyformsGlobal.admin_url,
        type: 'POST',
        dataType: 'json',
        data: {
            "action": "buddyforms_step_forms_get_steps",
            "form_slug": $form_slug
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
        success: function (response) {
            console.log(response);

            var $tree = jQuery('#step-' + $form_slug).tree({
                dragAndDrop: true,
                autoOpen: 0,
                //tabIndex: 1,
                data: response,
                selectable: true,
                onCanSelectNode: function (node) {
                    if (node.children.length == 0) {
                        // Nodes without children can be selected
                        return true;
                    } else {
                        // Nodes with children cannot be selected
                        return false;
                    }
                },
                onCanMove: function (node) {

                    console.log(node.parent.parent);

                    if (!node.parent.parent) {
                        // Example: Cannot move root node)
                        return false;
                    } else {
                        return true;
                    }
                },
                onCanMoveTo: function (moved_node, target_node, position) {
                    console.log(target_node);
                    if (target_node.parent.name) {
                        return false;
                    } else {

                        if (position !== 'inside') {
                            return false;
                        }
                        return true;
                    }
                },
                onCreateLi: function (node, $li) {
                    // Append a link to the jqtree-element div.
                    // The link has an url '#node-[id]' and a data property 'node-id'.
                    $li.find('.jqtree-title-folder').append(
                        '<a href="#node-' + node.id + '" class="edit" data-node-id="' + node.id + '"> Rename</a>'
                    );
                }
            });

            // Handle a click on the edit link
            $tree.on('click', '.edit', function (e) {
                // Get the id from the 'node-id' data property
                var node_id = jQuery(e.target).data('node-id');

                // Get the node from the tree
                var node = $tree.tree('getNodeById', node_id);

                if (node) {
                    // Display the node name


                    jQuery('<form><input value="' + node.name + '" type="text" style="z-index:10000" name="node_name"><br></form>').dialog({
                        modal: true,
                        buttons: {
                            'OK': function () {
                                var name = jQuery('input[name="node_name"]').val();
                                $tree.tree('updateNode', node, name);
                                jQuery(this).dialog('close');
                            },
                            'Cancel': function () {
                                jQuery(this).dialog('close');
                            }
                        }
                    });
                }
            });


            $tree.on(
                'tree.move',
                function (event) {
                    event.preventDefault();
                    //console.log(event);

                    if (typeof event.move_info.target_node.parent === 'object') {
                    } else {

                    }
                    event.move_info.do_move();
                }
            );


            //
            // Display tab options on select
            //
            $tree.on(
                'tree.select',
                function (event) {
                    if (event.node) {
                        // node was selected
                        var node = event.node;


                        jQuery('#step-form-node-options').html(node.name);
                    } else {
                        // event.node is null
                        // a node was deselected
                        // e.previous_node contains the deselected node
                    }
                }
            );

        }

    });
}