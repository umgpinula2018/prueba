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

	$("#loader").fadeOut();
    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        startDate: 'today',
    });

    function limpia(){
        $('#form-aprobar')[0].reset();
        $("#form-aprobar").validate().resetForm();
        $('#fecha_entrega')        .removeClass('valid');
        $('#comentario_aprobacion').removeClass('valid');
        $('#fecha_entrega')        .removeClass('error');
        $('#comentario_aprobacion').removeClass('error');
    };

    $('#tabla-registros').on('click','.btn-aprobar', function(){ limpia(); });

	llenarTabla();
//-----------------------------------------------------FUNCION PARA LLENAR TABLA-------------------------------------
	function llenarTabla(){
		$("#loader").show();
		window.tablaSolicitudes.clear().draw();

		$.ajax({
			url:		'ws/documentos/solicitudes',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){	
			if( data.result ){
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;
					var fecha =value.created_at;
					A=new Date(Date.parse(fecha)).getFullYear();
                    M=new Date(Date.parse(fecha)).getMonth()+1;
                    D=new Date(Date.parse(fecha)).getDate();

					estado = (value.estado==1?"<span class=\"label label-success\">Aprobado</span>":"<span class=\"label label-danger\">Pendiente</span>");

					counter1  = contador;
					counter2  = value.ubicacion;
					counter3  = value.area.nombre;
					counter4  = value.tipo_documentos.nombre;
					counter5  = value.nombre_solicitante;
					counter6  = value.numero_empleado;
					counter7  = value.departamento;
					counter8  = value.jefe;
					counter9  = value.usuario_solicitante;
					counter10 = value.descripcion;
					counter11 = D+'/'+M+'/'+A;
					counter12 = '<center><a class="btn-aprobar btn btn-success btn-xs" title="Aprobación solicitud" href="#modal-aprobar" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-check-square"></i></a></center>';
					window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8,counter9,counter10,counter11,counter12]).draw(false);

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
		if ( $( '#form-aprobar' ).valid() ){
			$("#loader").show();
		
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/documentos/solicitudes/aprobar/'+idsolicitud,
				dataType: 	'json',
				data: 		$('#form-aprobar').serialize(),
				success: function( result )
					{
						if( result.result )
						{

							$('#modal-aprobar').modal('hide');
							toastr['success'](result.message, 'Éxito');
							setTimeout( function(){ amigable(); }, 100);  
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