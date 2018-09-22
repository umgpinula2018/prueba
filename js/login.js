jQuery(document).on("ready", iniciar);
function hacerLogin( e )
{
 	e.preventDefault();
	var datos = jQuery(this).serialize();
	// jQuery.ajax
	// ({
	// 	type: 		"GET",
	// 	url: 		"ws/login_office",
	// 	dataType: 	"json",
	// 	data: 		datos,
	// 	success: function ( result )
	// 		{
	// 			if( result.result )
	// 			{
	// 				//toastr["success"](result.message, 'Éxito');
	// 				setTimeout( "window.location.href = '../public/'" , 1000 );
	// 			}
	// 			else
	// 				console.log(result);
	// 		},
	// 	error: function ( err )
	// 		{
	// 				console.log(err);
	// 		}
	// });
}

function iniciar( e )
{
	jQuery("#form-login").on("submit", hacerLogin);
}