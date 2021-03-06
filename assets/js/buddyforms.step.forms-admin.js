const KEY_ENTER = 13;


jQuery(document).ready(function (jQuery) {

    //
    // Create the tabs
    //
    jQuery("#buddyforms-step-forms-tabs").tabs();
    jQuery('.buddyforms-sf-sidebar-tabs').tabs();


    jQuery('#step-forms-form-select').val(buddyforms_sf_get_current_form());

    //
    // Switch the Tabs with a select
    //
    jQuery(document.body).on('change', '#step-forms-form-select', function () {
        form_slug = jQuery("#step-forms-form-select").val();
        jQuery('#buddyforms-step-forms-tabs').find('a[href="#tab-' + form_slug + '"]').click();
    });


    //
    // Display Global Sidebar Menu
    //
    jQuery(document.body).on('click', '.buddyforms-sf', function(event) {      
        
        if(!jQuery(event.target).closest(".buddyforms-sf-field, .buddyforms-sf-sidebar, a, select").length){ 
            const form_slug = buddyforms_sf_get_current_form();
            buddyforms_st_show_global_sidebar(form_slug);
        }
    });

    //
    // Save the step form
    //
    jQuery(document.body).on('click', '.buddyforms-sf-save', function () {

        const form_slug = jQuery(this).attr('data-slug');
        const json = jQuery('#step-' + form_slug).tree('toJson');

        jQuery.ajax({

            url: buddyformsGlobal.admin_url,
            type: 'POST',
            dataType: 'json',
            data: {
                "action": "buddyforms_step_forms_save_step",
                "form_slug": form_slug,
                "json": json
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
            success: function (response) {
                const $sidebar = jQuery(`#tab-${form_slug} .buddyforms-sf-sidebar`);
                $sidebar.find('.buddyfoms-sf-global-sidebar .buddyfoms-sf-shortcode')
                    .html(`<strong>Shortcode</strong>: ${response[form_slug].shortcode}`)
                ;

                alert('Step form Saved');
            }

        });
    });

    //
    // Delete step
    //
    jQuery(document.body).on('click', '.buddyforms-sf-delete-step', function(event) {

        event.stopPropagation();
        
        const form_slug = buddyforms_sf_get_current_form();
        const $tree = jQuery(`#step-${form_slug}`);
        const node_id = jQuery(event.currentTarget).data('node-id');
        
        buddyforms_sf_delete_step($tree, node_id);
        buddyforms_st_show_global_sidebar(form_slug);
    });

    //
    // Edit step
    //
    jQuery(document.body).on('click', '.buddyforms-sf-edit-step', function (event) {

        const form_slug = buddyforms_sf_get_current_form();
        const $tree = jQuery(`#step-${form_slug}`);
        const $sidebar = jQuery(`#tab-${form_slug} .buddyforms-sf-sidebar`);

        // Get the id from the 'node-id' data property
        const node_id = jQuery(event.currentTarget).data('node-id');

        // Get the node from the tree
        const node = $tree.tree('getNodeById', node_id);

        const updateNode = function(node) {
            const name = jQuery(`input[name="node_name_${node.id}"]`).val();
            $tree.tree('updateNode', node, name);
        }

        if (node) {
            // Display the node name

            jQuery(`<form><input value="${node.name}" type="text" style="z-index:10000" name="node_name_${node.id}"><br></form>`).dialog({
                modal: true,
                buttons: {
                    'OK': function () {
                        updateNode(node);
                        jQuery(this).dialog('close').dialog('destroy');
                        buddyforms_st_show_step_sidebar(form_slug, node);
                    },
                    'Cancel': function () {
                        jQuery(this).dialog('close').dialog('destroy');
                    }
                }
            });

            //
            // Avoid keypress redirections 
            //
            jQuery(`input[name="node_name_${node.id}"]`).keypress(function(event) {
                if (KEY_ENTER === event.keyCode) {
                    event.preventDefault();
                    updateNode(node);
                    jQuery(this).parents('.ui-dialog-content').dialog('close').dialog('destroy');
                    buddyforms_st_show_step_sidebar(form_slug, node);                }
            });
        }
    });
});


//
// get the step form json
//
function buddyforms_sf_get_step($form_slug) {

    jQuery.ajax({

        url: buddyformsGlobal.admin_url,
        type: 'POST',
        dataType: 'json',
        data: {
            "action": "buddyforms_step_forms_get_steps",
            "form_slug": $form_slug
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
        success: function (response) {
            const $tree = jQuery('#step-' + $form_slug).tree({
                dragAndDrop: true,
                autoOpen: true,
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
                onCanMoveTo: function (moved_node, target_node, position) {

                    const moved_node_is = !moved_node.parent.parent ? 'parent' : 'child';
                    const target_node_is = !target_node.parent.parent ? 'parent' : 'child';

                    // Child node can't be moved after or before a parent node.
                    if (target_node_is === 'parent' && moved_node_is === 'child' && position !== 'inside') {
                        return false;
                    }
                    
                    // Any node can't be place inside a child node.
                    if (target_node_is === 'child' && position === 'inside') {
                        return false;
                    }

                    // Parent node can't be moved after or before a child node.
                    if (target_node_is === 'child' && moved_node_is === 'parent') {
                        return false;
                    }

                    // Parent node can't be place inside to another parent node.
                    if (target_node_is === 'parent' && moved_node_is === 'parent' && position === 'inside') {
                        return false;
                    }

                    return true;
                },
                onCreateLi: function (node, $li) {
                    if (!node.parent.name) {
                        buddyforms_sf_init_step_node(node, $li);
                    } else {
                        buddyforms_sf_init_field_node(node, $li);
                    }
                }
            });

            $tree.on('click', '.buddyforms-sf-add-step-after', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_sf_create_step($tree, node_id, 'after');
            });

            $tree.on('click', '.buddyforms-sf-add-step-before', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_sf_create_step($tree, node_id, 'before');

            });

            //
            // Toogle Steps
            //
            $tree.on('click', '.buddyforms-sf-step-header', function(event) {
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_sf_toggle_step($tree, node_id);
            });

            //
            // Display Field Sidebar Menu
            //
            $tree.on('tree.select', function (event) {
                if (event.node) {
                    const node = event.node;
                    const form_slug = $tree.data('slug');

                    buddyforms_st_show_field_sidebar(form_slug, node);
                }
            });

            //
            // Display Step Sidebar Menu
            //
            $tree.on('click', '.buddyforms-sf-step-options', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                const node = $tree.tree('getNodeById', node_id);
                const form_slug = $tree.data('slug');

                buddyforms_st_show_step_sidebar(form_slug, node);
            });
        }

    });
}


/**
 * @param {JQuery object} $tree 
 * @param {int|string} node_id
 * @param {string} direction [after, before]
 */
function buddyforms_sf_create_step($tree, node_id, direction) {

    direction = direction || 'after';
    const node = $tree.tree('getNodeById', node_id);
    const form_slug = $tree.data('slug');

    const new_node = $tree.tree(
        direction === 'after' ? 'addNodeAfter' : 'addNodeBefore',
        {
            name: `Step`,
            id: Date.now(),
            children: []
        },
        node
    );

    buddyforms_sf_init_step_node(new_node);
    buddyforms_st_show_step_sidebar(form_slug, new_node);
}

/**
 * @param {JQuery object} $tree 
 * @param {int|string} node_id
 */
function buddyforms_sf_delete_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    const node_children = [...node.children];

    if (Array.isArray(node_children) && node_children.length) {

        if (!buddyforms_sf_step_is_erasable(node)) {
            return;
        }

        const node_children = [...node.children];
        node_children.forEach(function(child) {
            $tree.tree('moveNode', child, backup_node, 'inside');
        });
    }

    $tree.tree('removeNode', node);
}

/**
 * @param {Object} node 
 */
function buddyforms_sf_step_is_erasable(node) {
    const sibling_nodes = node.parent.children;
    const node_index = sibling_nodes.findIndex(function(item) {
        return item.id === node.id;
    });

    backup_node = (node_index - 1 >= 0) 
        ? sibling_nodes[node_index - 1] 
        : sibling_nodes[sibling_nodes.length - 1];


    return backup_node !== node; 
}

/**
 * @param {JQuery object} $tree 
 * @param {int|string} node_id 
 */
function buddyforms_sf_toggle_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    $tree.tree( 
        !node.is_open ? 'openNode' : 'closeNode', 
        node
    );
}

/**
 * @param {object} node 
 * @param {jQuery object} $el 
 */
function buddyforms_sf_init_step_node(node, $el) {

    $el = $el || jQuery(node.element);

    if (!$el) {
        return;
    }

    if (node.parent.name) {
        return;
    }

    $el.addClass('buddyforms-sf-step')
        .children('.jqtree-element')
        .html(`
            <header class="buddyforms-sf-step-header buddyforms-sf-box-small" data-node-id="${node.id}">
                <p>${node.name}</p>
                <button data-node-id="${node.id}" class="buddyforms-sf-add-step-before buddyforms-sf-btn">
                    Add Before
                    <span class="iconify" data-icon="dashicons-insert-before" data-inline="false"></span>
                </button>
                <button data-node-id="${node.id}" class="buddyforms-sf-add-step-after buddyforms-sf-btn">
                    Add After
                    <span class="iconify" data-icon="dashicons-insert-after" data-inline="false"></span>
                </button>
                <button data-node-id="${node.id}" class="buddyforms-sf-step-options buddyforms-sf-btn">
                    Step Options
                    <span class="iconify" data-icon="dashicons:admin-generic" data-inline="false"></span>
                </button>
            </header>
        `)
    ;
}

/**
 * @param {object} node 
 * @param {JQuery object} $li 
 */
function buddyforms_sf_init_field_node(node, $li) {
    $li.find('.jqtree-element')
       .addClass('buddyforms-sf-field')
       .addClass('buddyforms-sf-box-small')
    ;
}

/**
 * @param {string} form_slug 
 * @param {string} $show_to [global, block]
 */
function buddyforms_sf_show_sidebar(form_slug, $show_to) {

    if (!['global', 'block'].includes($show_to)) {
        console.error('Missing tab:', $show_to);
        $show_to = 'global';
    }

    jQuery(`a[href="#tab-${$show_to}-${form_slug}"]`).click();
}

/**
 * @param {string} form_slug 
 */
function buddyforms_st_show_global_sidebar(form_slug) {
    $block_sidebar = jQuery(`#tab-block-${form_slug}`);
    $block_sidebar.html(`
        <p class="buddyfoms-sf-no-block-selected">
            No block selected.
        </p>
    `);

    // Deselect all node.
    jQuery('#step-' + form_slug).tree('selectNode', null);

    buddyforms_sf_show_sidebar(form_slug, 'global');
}

/**
 * @param {string} form_slug 
 * @param {Object} node 
 */
function buddyforms_st_show_step_sidebar(form_slug, node) {
    $block_sidebar = jQuery(`#tab-block-${form_slug}`);
    $block_sidebar.html(`
        <h2>
            Step Name: ${node.name}
            <button data-node-id="${node.id}" class="buddyforms-sf-edit-step buddyforms-sf-btn">
                <span class="iconify" data-icon="dashicons:edit-large" data-inline="false"></span>
            </button>
        </h2>
        <div class="buddyfoms-sf-sidebar-actions">
            <button 
                data-node-id="${node.id}"
                class="buddyforms-sf-btn-danger buddyforms-sf-delete-step"
                ${!buddyforms_sf_step_is_erasable(node) ? 'disabled' : ''}
            >
                Delete Step
                <span class="iconify" data-icon="dashicons:trash" data-inline="false"></span>
            </button>
        </div>
    `);

    buddyforms_sf_show_sidebar(form_slug, 'block');
}

/**
 * @param {string} form_slug 
 * @param {Object} node 
 */
function buddyforms_st_show_field_sidebar(form_slug, node) {
    $block_sidebar = jQuery(`#tab-block-${form_slug}`);
    $block_sidebar.html(`
        <h2>Field Name: ${node.name}</h2>`
    );

    buddyforms_sf_show_sidebar(form_slug, 'block');
}

/**
 * @returns {string}
 */
function buddyforms_sf_get_current_form() {
    return jQuery('#buddyforms-step-forms-tabs-list').find('.ui-state-active').data('slug');
}