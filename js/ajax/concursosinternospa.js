jQuery( document ).ready( function( $ )
{
	var idregistro = 0;

	window.tabla_registros = $('.datatable').DataTable(
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

	//Funciones
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/concursos/puestos/activoscerrados',
			dataType: 	'json'
		})
		.done(function( data )
		{
			if( data.result )
			{
				cont = 0;
				$.each(data.records, function( index, value)
				{
					col1 = ++cont;
					col2 = value.puesto;
					col3 = value.descripcion;
					col4 = value.fecha_inicio;
					col5 = value.fecha_fin;
					col6 = value.paises_txt;
					col7 = value.uens_txt;
					col8 = '<span class="label label-success" data-idregistro="'+value.id+'">'+value.destacado_txt+'</span>';
					col9 = value.nombre_usuario_creo;
					col10 = '<span class="label label-info" data-idregistro="'+value.id+'">'+value.estado_txt+'</span>';
					col11 = '<a class="btn btn-info btn-xs btn-list" href="#modal-lista" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-list"></i></a>';
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11]).draw(false);
				});
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function()
		{
			$('#loader').fadeOut();
		});
	}

	$("#tabla-registros").on('click','a.btn-list', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/concursos/listaaspirantes",
	        data: { idpuesto:idregistro },
	        success : function( result )
        	{
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito');
		            $("#tabla-aspirantes").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
	            		cont++;
						check = value.estado == 1 ? '<label> <input type="checkbox" class="seleccionado" checked name="seleccionado" data-idregistro="'+value.id+'"></label>' : '<label> <input type="checkbox" class="seleccionado" name="seleccionado" data-idregistro="'+value.id+'"></label>';
						curriculum = value.curriculum != '' ? '<a href="'+value.curriculum+'">Ver Curriculum</a>' : 'Sin Curriculum';

		            	$("#tabla-aspirantes").dataTable().fnAddData( [ 
		            		cont,
		            		value.nombre_usuario,
		            		value.usuario_aplica,
		            		value.telefono,
		            		value.departamento,
		            		curriculum,
		            		check
						]);
		            });
          		}
		  		else
		  		{
		            $("#tabla-aspirantes").dataTable().fnClearTable();
					toastr['warning'](result.message, 'Espera');
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#tabla-aspirantes').on('click', 'input.seleccionado', function ( e )
	{
		idreg = $(this).data('idregistro');
		valor = $(this).is(':checked') == true ? 1 : 0;
		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/concursos/seleccionaraspirante',
			dataType: 	'json',
			data: 		{estado:valor, registro:idreg},
			success: function ( result )
			{
				if( result.result ){}
				else {}
			},
			error: function ( result )
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	});
});