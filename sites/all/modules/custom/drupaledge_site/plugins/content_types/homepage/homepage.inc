<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Callback functionn to supply a list of content types.
 */

function drupaledge_site_homepage_ctools_content_types() {
  return array(
    'single' => TRUE,
    'title' => t('Homepage'),
    'icon' => 'icon.png',
    'description' => t('Render homepage'),
    'all contexts' => TRUE,
    'category' => t('drupaledge'),
    'hook theme' => 'drupaledge_site_homepage_content_type_theme',
  );
}

/**
 * Implements hook_theme().
 */
function drupaledge_site_homepage_content_type_theme(&$theme, $plugin) {
  $theme['drupaledge_site_homepage'] = array(
    'path' => $plugin['path'],
    'template' => 'homepage',
  );
}

/**
 * Renders homepage ctools content type.
 */
function drupaledge_site_homepage_content_type_render() {
  $block = new stdClass();
  $block->content = theme('drupaledge_site_homepage');
  return $block;
}

/**
 * 
 */
function template_preprocess_drupaledge_site_homepage(&$variables) {
  $variables['hello'] = t('hello man');
}
