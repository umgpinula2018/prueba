	var json = [];
jQuery(document).ready(iniciar);
function iniciar()
{
	var Cantidad=0;
	jQuery('#loader').show();
	window.tabla_BD = jQuery('#tabla-registros').DataTable(
		{
		"order": [[ 8, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 8 ],
                "visible": false,
                "searchable": false
            }
        ],
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
    var idEliminar='';
	var idRegistro='';
	jQuery('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

	jQuery('#btn-exportar').on('click',function(e){
		e.preventDefault();
		window.location.href = "ws/travel/liquidaciones/finalizadas/exportar";
		toastr["success"]("Exportado correctamente", "Éxito");
	});

	BD_Cargar();

	function BD_Cargar(){
		//console.log('BD Cargada Exitosamente');

		window.tabla_BD.clear().draw();
		jQuery.ajax({
			url:'ws/travel/liquidaciones/finalizadas',	
			type:'POST', 	
			dataType: 'json',
			data : {usuario: localStorage.USUARIO},
		}).done(function( data ){
			var consulta=data.records;	
			jQuery.each(consulta, function (index, valor) { 
				row1='<center>'+valor.correlativo+'</center>';
				row2=valor.nombre_creo;
				if( valor.tarjeta )
					row3 = '<span class="label label-primary"> Monibyte </span>';
				else
					row3 = '<span class="label label-success"> No monibyte </span>';
				row4 = valor.justificacion;
				row5 = valor.fecha_finalizacion;
				row6 = valor.fecha_liquidacion;
				row7 = '<i class="fa fa-check"> Finalizadas</i>';
				row8 = valor.sticker;
				row9 = valor.updated_at;
                window.tabla_BD.row.add([row1,row2,row3,row4,row5,row6,row7,row8,row9]).draw(false);
			});
			console.log(consulta);
		})
		.fail(function(error){console.log('error: ');console.log(error);})
		.always(function(error){jQuery('#loader').hide();})
	}


}
