jQuery( document ).ready( function( $ ){

	var idsolicitud = 0;

	window.tablaSolicitudes = $("#tabla-registros").DataTable(
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
//-----------------------------------------------------FUNCION PARA LLENAR TABLA-------------------------------------
	function llenarTabla(){
		$("#loader").show();
		window.tablaSolicitudes.clear().draw();
		usuario = $("#usuario").val();
		$.ajax({
			url:		'ws/documentos/solicitud/constancias',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){	
			if( data.result ){
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;
					estado = (value.estado==1?"<span class=\"label label-success\">Aprobado</span>":"<span class=\"label label-danger\">Pendiente</span>");
					
					counter1  = contador;
					counter2  = value.fecha;
					counter3  = value.numero_empleado;
					counter4  = value.nombre_solicitante;
					counter5  = value.descripcion_tipo;
					counter6  = value.jefe;
					counter7  = value.email_solicitante;
					counter8  = '<center><a class="btn-aprobar btn btn-success btn-xs" title="Aprobación solicitud" href="#modal-aprobar" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-arrow-circle-down"></i></a></center>';
					window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8]).draw(false);

				});
			}		
		})
		.fail(function(err){
			console.log(err);
		})
		.always( function(){
			$("#loader").fadeOut();
		});		
	}

	// ID para aprobar el solicitud 
	$("#tabla-registros").on('click', '.btn-aprobar', function( e ){
		idsolicitud = $(this).data("idsolicitud");
	});

	
//-------------------------------------------------------EVENTOS------------------------------------------------
	
	$('#btn-aceptar').on('click', aprobar);

//------------------------------------------------FUNCIONES DE EVENTOS------------------------------------------

	function aprobar( e )
	{
		e.preventDefault();
		$("#loader").show();		
		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/documentos/aprobacion/constancias',
			dataType: 	'json',
			data: 		{ id: idsolicitud, usuario: $('#usuario').val(), firmante: localStorage.EMPID },
			success: function( result )
				{
					if( result.result )
					{
						window.location.href = 'ws/documentos/constancia/generar?id='+idsolicitud+'&firmante='+localStorage.EMPID;
						$('#modal-aprobar').modal('hide');
						toastr['success'](result.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 100);
					}
					else
					{
                        $("#loader").hide();
						toastr['error'](result.message, 'Error');
					}
				},
			error: 	function( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
		});
    }

	$('#form-aprobar').validate(
	{
		rules:
		{
			comentario_aprobacion:{
				required:true,
				maxlength:60
			},
		},
		messages:
		{
			comentario_aprobacion: "Por favor, introduzca no más de 60 caracteres.",
		}
	});
});