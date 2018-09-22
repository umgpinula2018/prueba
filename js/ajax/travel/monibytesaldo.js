jQuery(document).ready(iniciar); 
function iniciar(){
	var pais_codigo=''
	var pais_nombre='';
	jQuery("#loader").show();
	window.tabla_BD = jQuery('#tbl-registros').DataTable(
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
    window.tabla_BD = jQuery('#tbl-ver').DataTable(
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

    // jQuery.ajax({
    //     type:       'GET',
    //     url:        'ws/sociedad/usuarios',
    //     dataType:   'json',
    // })
    // .done(function(data){
    //     if( data.result )
    //     {
    //         pais_codigo = data.records.LAND1;
    //         if( pais_codigo=='GT' )
    //             pais_nombre='Guatemala';
    //         if( pais_codigo=='CR' )
    //             pais_nombre='Costa Rica';
    //         if( pais_codigo=='SV' )
    //             pais_nombre='El Salvador';
    //     }
    //     else
    //         toastr['error'](data.message, 'Error');
    // }).fail(function(err){
    //     console.log('Pais no se detectó');
    // });
    jQuery('#loader').hide();

    BD_Cargar();
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Botones
    // jQuery('#tbl-registros').on('click','.btn-ver', ver);
    jQuery('#btn-busqueda').on('click', function(e){
    	e.preventDefault();
    	BD_Cargar();
    });

	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Funciones
	function BD_Cargar(){
		jQuery('#exportar').attr('disabled');

		jQuery('#loader').show();
		jQuery('#tarjeta').val(jQuery('#buscar').val());
		console.log(jQuery('#buscar').val());
		jQuery.ajax({
			url:'ws/travel/monibyte/saldos',	
			type:'GET', 	
			dataType: 'json'
		}).done(function( data ){
			if(data.result){
				console.log(data.records);
				jQuery('#exportar').removeAttr('disabled');
				consulta = data.records;
				jQuery("#tbl-registros").dataTable().fnClearTable();

				jQuery.each( consulta, function( index,value ){
					if( parseFloat(value.monto)>0 ){
						jQuery('#tbl-registros').dataTable().fnAddData([
			                value.solicitud,
			                value.usuario,
			                formato_fecha(value.fc),
			                value.moneda,
			                value.monto,
			            ]);
					}
		            jQuery("#loader").fadeOut();
				});
				
			}else{
				toastr["success"]("No hay Usuarios con saldo pendientes", "Éxito");
				jQuery("#loader").fadeOut();
			}
				jQuery("#loader").fadeOut();
		}).fail(function(error){
			console.log('error: ');console.log(error);
			jQuery("#loader").fadeOut();
		})
	}

	jQuery('#exportar').on('click', function(){
		window.location.href = "ws/travel/monibyte/exportar/saldos";
		toastr["success"]("Exportado correctamente", "Éxito");
			
	});
};

function formato_fecha(id){
		var A=new Date(Date.parse(id)).getFullYear();
	    var M=new Date(Date.parse(id)).getMonth()+1;
	    var D=new Date(Date.parse(id)).getDate()+1;
	    if(M<10)
	        M='0'+M;
	    if(D<10)
	        D='0'+D;
	    var fecha=D+'/'+M+'/'+A;
	    return fecha;
	}




