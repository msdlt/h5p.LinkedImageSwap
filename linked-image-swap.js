//var H5P = H5P || {};

/**
 * @todo: add input and display alt text
 * 
 */

/**
 * LinkedImageSwap module
 *
 * @param {jQuery} $
 */


 
H5P.LinkedImageSwap = (function ($) {
  /**
   * Initialize a new LinkedImageSwap
   * 
   * @class H5P.LinkedImageSwap 
   */
  function LinkedImageSwap(params, contentId) { //}, contentData) {
    // Keep provided id.
    this.contentId = contentId;
    H5P.EventDispatcher.call(this);

    // Extend defaults with provided options
    this.params = $.extend({}, {
      defaultImage: '', // @todo don't really want to give this a default value??
      linkedImages: []
    }, params);

    this.linkedImages = [];
    this.linkButtons = [];

    //this.contentData = contentData;

    /*if (this.options.task) {
      // Initialize task
      this.task = H5P.newRunnable(this.options.task, this.id);
     
      // Trigger resize events on the task:
      this.on('resize', function (event) {
        this.task.trigger('resize', event);
      });
    }*/
  };
 
  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  LinkedImageSwap.prototype.attach = function ($container) {
    var self = this;
    // Set class on container to identify it as a linked image swap
    // container.  Allows for styling later.
    $container.addClass("h5p-linkedimageswap-container");
    //start by adding div and image
    $imageContainer = $('<div>')
      .addClass('h5p-linkedimageswap')
      .append('<img class="h5p-linkedimageswap-image" src="' + H5P.getPath(self.params.defaultImage.path, self.contentId) + '" id="linkedImage" name="linkedImage">');
      //.append('<img class="h5p-linkedimageswap-image" src="' + self.params.defaultImage.path + '" id="linkedImage" name="linkedImage">');
    $container.append($imageContainer);
    //then add list
    $container.append('<ul class="h5p-linkedimageswap-options" role="radiogroup"></ul>');

    //now create buttons and images
    self.linkedImages[0] = H5P.getPath(self.params.defaultImage.path, self.contentId);
    self.createLinkButton(0, 'Default');
    self.linkButtons[0].focus();
    
    for (var i = 0; i < self.params.linkedImages.length; i++) {
      self.linkedImages[i+1] = H5P.getPath(self.params.linkedImages[i].linkedImage.path, self.contentId);
      self.createLinkButton(i+1, self.params.linkedImages[i].linkText);
    }

    /*setTimeout(function () {
      self.$.trigger('resize');
    }, 1000);*/
    
  };

  /**
   * Create HTML for Panel.
   * @param {number} id
   */
  LinkedImageSwap.prototype.createLinkButton = function (id, linkText) {
    var self = this;
    var linkButtonId = 'h5p-linkedimageswap-link-button' + this.idPrefix + id;
    // Create list item radio button
    var $linkButton =  $('<li/>', {
        'id': linkButtonId,
        //'class': 'h5p-panel-title',
        'role': 'radio',
        'tabindex': (id === 0 ? '0':'-1'),
        'aria-selected': (id === 0 ? 'true' : 'false'),
        'aria-checked': (id === 0 ? 'true' : 'false'),
        'html': '<p>' + linkText + '</p>',
      });
      //now let's add some event handlers to our button
      $linkButton.on('click', function(){
        self.swapImage(id);
      })
      $linkButton.on('keydown', function(event){
        switch (event.keyCode) {
          case 38:   // Up
          case 37: { // Left
            if(id > 0) {
              self.swapImage(id - 1);
            } else {
              self.swapImage(self.linkedImages.length);
            }
            return false;
          }
          case 40:   // Down
          case 39: { // Right
            if(id < self.linkedImages.length) {
              self.swapImage(id + 1);
            } else {
              self.swapImage(0);
            }
            return false;
            }
          case 32:   // SPACE
          case 13: { // ENTER
            self.swapImage(id);
            return false;
          }
        }
      })
      $('.h5p-linkedimageswap-options').append($linkButton);
      self.linkButtons.push($linkButton);
  }

  LinkedImageSwap.prototype.swapImage = function(id) {
    var self = this;
    $('#linkedImage').attr('src', self.linkedImages[id]);
    self.doChecking(id);
  }

  LinkedImageSwap.prototype.doChecking = function(id) {
    var self = this;
    for (var i = 0; i < self.linkButtons.length; i++) {
      if (i !== id) {
        self.linkButtons[i].attr('aria-checked', false); 
        self.linkButtons[i].attr('aria-selected', false);  
        self.linkButtons[i].attr('tabindex', -1);
      } else {
        self.linkButtons[i].attr('aria-checked', true);
        self.linkButtons[i].attr('aria-selected', true);  
        self.linkButtons[i].attr('tabindex', 0);  
        self.linkButtons[i].focus(); 
      }
  }
}
 
  return LinkedImageSwap;
})(H5P.jQuery);