
//code for jquery ui modal widget functionality
$( function() {
    $( "#error-message-modal" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );