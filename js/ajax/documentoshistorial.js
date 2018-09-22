jQuery( document ).ready( function( $ ){

	window.tablaHistorial = $("#tabla-registros").DataTable(
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
		window.tablaHistorial.clear().draw();

		$.ajax({
			url:		'ws/documentos/solicitudes/historial',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){	
			if( data.result ){
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;

					var fecha_solicitud = value.created_at;
					A=new Date(Date.parse(fecha_solicitud)).getFullYear();
                    M=new Date(Date.parse(fecha_solicitud)).getMonth()+1;
                    D=new Date(Date.parse(fecha_solicitud)).getDate();

                    var fecha_aprobacion = value.updated_at;
					año=new Date(Date.parse(fecha_aprobacion)).getFullYear();
                    mes=new Date(Date.parse(fecha_aprobacion)).getMonth()+1;
                    dia=new Date(Date.parse(fecha_aprobacion)).getDate();

                    function capitalize(string) {
					    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
					}
					var nombre    = capitalize(value.nombre_solicitante);
					var aprobador = capitalize(value.nombre_aprobador);

					estado = (value.estado==1?"<span class=\"label label-success\">Aprobado</span>":"<span class=\"label label-danger\">Pendiente</span>");
					counter1 = contador;
					counter2 = value.area.nombre;
					counter3 = value.ubicacion;
					
					if (value.tipo_documentos)
						counter4 = value.tipo_documentos.nombre;
					else
						counter4 = value.descripcion_tipo;

					counter5 = value.usuario_solicitante;
					counter6 = '<label style="text-transform: capitalize;">'+nombre+'</label>';
					counter7 = '<label style="text-transform: capitalize;">'+aprobador+'</label>';
					counter8 = value.parse_creacion;
					if (value.fecha_entrega == '0000-00-00 00:00:00')
						counter9 = 'Pendiente de envio';
					else
						counter9 = value.fecha_entrega;
					if (value.comentario_aprobacion)
						counter10 = value.comentario_aprobacion;
					else
						counter10 = 'Sin comentario';
					counter11 = estado;				
					window.tablaHistorial.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8,counter9,counter10,counter11]).draw(false);
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

})