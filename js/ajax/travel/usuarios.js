jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;

	//Propiedades
	window.tabla_registros = $('#tabla-registros').DataTable(
	{
		"oLanguage": {
			"sLengthMenu": "Mostrando _MENU_ filas",
			"sSearch": "",
			"sProcessing":     "Procesando...",
			"sLengthMenu":     "Mostrar _MENU_ registros",
			"sZeroRecords":    "No se encontraron resultados",
			"sEmptyTable":     "Ningún dato disponible en esta tabla",
			"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
			"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
			"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
			"sInfoPostFix":    "",
			"sSearch":         "Buscar:",
			"sUrl":            "",
			"sInfoThousands":  ",",
			"sLoadingRecords": "Cargando...",
			"oPaginate": {
				"sFirst":    "Primero",
				"sLast":     "Último",
				"sNext":     "Siguiente",
				"sPrevious": "Anterior"
			}
		}
	});

	//Eventos
	llenarTabla();
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	
	//Funciones
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/travel/usuario',
			dataType: 	'json',
		})
		.done( function( data )
		{	
			if( data.result )
			{
				$.each(data.records, function( index, value )
				{	
					col1 = ++index;
					col2 = value.nombre;
					col3 = value.email;
					col4 = value.jefe;
					col5 = value.jefe_email;
					col6 = '<a class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" title="Eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>'+
						   '<a class="btn btn-primary btn-xs btn-editar" style="margin-left:10px;" title="Editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>';
							
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6]).draw(false);
				});
			//console.log(data.records);
			}
			else
				toastr['error'](data.message, 'Error');
		})
		.fail( function( error )
		{
			console.log(error);
		})
		.always(function()
		{
			$('#loader').fadeOut();
		});
	}
	$('#crearRegistro').on('click',function(){
		$('#form-crear #email').val('');
		$('#form-crear #email').removeClass('valid');
		$('#form-crear #email').removeClass('error');
	});
	function store( e )
	{
		e.preventDefault();
		//console.log($('#form-crear').serialize());
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/travel/usuario',
				dataType: 	'json',
				data: 		datos,
				success: function( result )
					{
						if( result.result )
						{
							//console.log('store');
							$('#modal-crear').modal('hide');
							toastr['success'](result.message, 'Éxito');
							setTimeout( function(){ amigable(); }, 500);  
						}
						else
						{
							toastr['error'](result.message, 'Error');
						}
					},
				error: 	function( result )
					{
						toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
					}
			});
		}
	}

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/travel/usuario/"+idregistro,
	        success : function( result )
        	{
        		//console.log(result.records);
				if( result.result )
				{
		            $("#form-editar #email").val(result.records.email);
		            if (result.records.travel_solicitud == "true") {
		            	$('#solicitante').prop('checked', true);
		            } 
		            if (result.records.travel_administrador == "true") {
		            	$('#administrador').prop('checked', true);
		            } 
		            if (result.records.travel_aprobacion == "true") {
		             	$('#aprobador').prop('checked', true);
		            }
		            if (result.records.travel_sap == "true") {
		             	$('#sap').prop('checked', true);
		            }  
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{	datos = $('#form-editar').serialize()
			//console.log(datos);
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/travel/usuario/'+idregistro,
				dataType: 	'json',
				data: 		$('#form-editar').serialize(),

				success: function ( result )
				{
					//console.log('hola');
					if( result.result )
					{
						//console.log('hola1');
						setTimeout( function(){ amigable(); }, 500);  						
						toastr['success'](result.message, 'Éxito')
				        $('#modal-editar').modal('hide'); 
					}
					else
					{
						toastr['error'](result.message, 'Error');
					}
				},
				error: function ( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	}

	$("#tabla-registros").on('click', 'a.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("idregistro");
	});

	function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	"ws/travel/usuario/"+ideliminar,
			success: function( result )
			{
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-eliminar").modal('hide');
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
			},
			error: function( result )
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}
});