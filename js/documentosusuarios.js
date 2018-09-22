jQuery( document ).ready( function( $ ){
	
	window.tablaAdministradores = $("#tabla-registros").DataTable(
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

	function llenarTabla(){
		$("#tabla-registros > tbody").html("");

		$.ajax({
			url:		'ws/documentos/administrador',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){			
			contador = 0;		
			$.each(data.records, function(index,value){
				contador++;
				counter1 = contador;
				counter2 = value.area.nombre;
				counter3 = value.usuarios.nombre;				
				counter4 = '<center><a class="btn-aprobar btn btn-success btn-xs" href="#modal-aprobar" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-check"></i></a></center>';
				window.tablaAdministradores.row.add([counter1,counter2,counter3,counter4]).draw(false);
			});
		})
		.fail(function(err){
			console.log(err);
		})	
	}

//---------------------------------------------------------EVENTOS-----------------------------------

	$('#btn-crear').on('click', store);

//--------------------------------------------------FUNCION CREAR USUARIOS----------------------------
	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/usuarioscomedores',
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

});