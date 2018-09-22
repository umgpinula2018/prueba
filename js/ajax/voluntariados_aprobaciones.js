jQuery( document ).ready( function( $ )
{
	var idsolicitud = 0;

	window.tablaAprobacion = $('#tabla-registros').DataTable(
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

	records();
	function records()
	{
		window.tablaAprobacion.clear().draw();
		$.ajax(
		{
			url: "ws/vlistasolicitudes",
			type: "GET",
			dataType: "json",
			data: { user: localStorage.USUARIO },
			success: function(data)
			{
				if(data.result)
				{
					var contador = 0;
					$.each( data.records, function(index, value)
					{
						contador++;
						counter1 = contador;
						counter2 = value.descripcion;
						counter3 = value.fecha;
						counter4 = value.hora;
						counter5 = value.empleado;
						counter6 = value.pern_empleado;
						counter7 = value.depto_empleado;
						counter8 = value.comentario;
						counter9 = '<a class="btn btn-success btn-xs btn-aprobar" href="#modal-aprobar" data-toggle="modal" data-registro="'+value.id+'"><i class="fa fa-check-square-o"></i></a>';

						window.tablaAprobacion.row.add([ counter1, counter2, counter3, counter4, counter5, counter6, counter7, counter8, counter9]).draw(false);
					});
					$('.btn-aprobar').on('click', function(){
						$('#comentario').val('');
					});
					$("#loader").fadeOut();
				}
				else
				{
					toastr['error'](data.message, 'Error');
				}
			},
			error: function()
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}

	$("#tabla-registros").on('click','.btn-aprobar', function( e )
	{
		e.preventDefault();				
		idsolicitud = $(e.target).closest("a").data("registro");
	});

	$("#btn-aprobar").on("click", function(e)
	{
		e.preventDefault();

		if( idsolicitud != 0 )
		{
			$.ajax(
			{
				url: "ws/vaprobarsolicitud",
				type: "POST",
				dataType: "json",
				data: { idsolicitud: idsolicitud, aprobador: localStorage.USUARIO, comentario: $("#comentario").val(), aprobado: 1 },
				success: function(data)
				{
					if(data.result)
					{
						toastr['success'](data.message, 'Éxito');
						$('#modal-aprobar').modal('hide');
						setTimeout(function(){ records(); }, 2000);
					}
					else
					{
						toastr['error'](data.message, 'Error');
					}
				},
				error: function()
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	});

	$("#btn-rechazar").on("click", function(e)
	{
		e.preventDefault();

		if( idsolicitud != 0 )
		{
			$.ajax(
			{
				url: "ws/vaprobarsolicitud",
				type: "POST",
				dataType: "json",
				data: { idsolicitud: idsolicitud, aprobador: localStorage.USUARIO, comentario: $("#comentario").val(), aprobado: 0 },
				success: function(data)
				{
					if(data.result)
					{
						toastr['success'](data.message, 'Éxito');
						$('#modal-aprobar').modal('hide');
						setTimeout(function(){ records(); }, 2000);
					}
					else
					{
						toastr['error'](data.message, 'Error');
					}
				},
				error: function()
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	});
});