jQuery( document ).ready( function( $ )
{	
	
	var idregistro = 0;
	var ideliminar = 0;

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

	llenarTabla();
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);

	$('#crearRegistro').on('click',function(){
		$('#form-crear #email').val('');
		$('#form-crear #email').removeClass('valid');
		$('#form-crear #email').removeClass('error');
	});
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type:  		'GET',
			url: 		'ws/usuariospresupuestos',
			dataType: 	'json',
		})
		.done( function( data )
		{
			if( data.result )
			{
				var cont = 0; var acciones = '';
				$.each(data.records, function( index, value )
				{	
					col1 = ++cont;
					col2 = value.nombre;
					col3 = value.email;
					col4 = value.depto;
					col5 = 	'<td>'+
								'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
						    	'<a style=" margin: 5px;" class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>'+
							'</td>'
					window.tabla_registros.row.add([col1,col2,col3,col4,col5]).draw(false);
				});
			}
			else
				console.log( data.message );
		})
		.fail( function( err ) 
		{
			console.log( err );
		})
		.always( function(  ) 
		{
			$('#loader').fadeOut();
		});
	}

	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/usuariospresupuestos',
				dataType: 	'json',
				data: 		datos,
				success: function( result )
					{
						if( result.result )
						{
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
	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/usuariospresupuestos/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #email").val(result.records.email);
		            $("#form-editar #nombre").val(result.records.nombre);
		            result.records.presupuestos_aprobadores == 1 ? $('#edit_aprobador').prop('checked', true) : $('#edit_aprobador').prop('checked', false);
		            result.records.presupuestos_admin == 1 ? $('#edit_administrador').prop('checked', true) : $('#edit_administrador').prop('checked', false);
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
		{
			$.ajax
			(
			{
				type: 		'PUT',
				url: 		'ws/usuariospresupuestos/'+idregistro,
				dataType: 	'json',
				data: 		$('#form-editar').serialize(),
				success: function ( result )
				{
					if( result.result )
					{
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
			url:	"ws/usuariospresupuestos/"+ideliminar,
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