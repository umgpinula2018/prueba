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

    BD_Cargar();
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Botones
    jQuery('#tbl-registros').on('click','.btn-ver', ver);
    jQuery('#btn-subir').on('click', subir);

	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Funciones
	function BD_Cargar(){
		jQuery.ajax({
			url:'ws/travel/monibyte',	
			type:'GET', 	
			dataType: 'json'
		}).done(function( data ){
			consulta = data.records;
			console.log(data.records);
			jQuery("#tbl-registros").dataTable().fnClearTable();
			jQuery.each( consulta, function( index,value ){
				jQuery('#tbl-registros').dataTable().fnAddData([
	                (index+1),
	                value.tarjeta,
	                '<span style="text-transform: capitalize;">'+value.usuario+'</span>',
	                value.no_id,
	                value.corte,
	                '<a data-placement="top" title="Ver sus detalles" class="btn-ver btn btn-info btn-xs toltip" href="#modal-ver" data-toggle="modal" data-id="'+value.id+'"><i class="fa fa-eye"> Ver</i></a> ',
	            ]);
			});
			jQuery("#loader").fadeOut();
		}).fail(function(error){
			console.log('error: ');console.log(error);
			jQuery("#loader").fadeOut();
		})
	}

	function ver( e ){
		e.preventDefault();
		jQuery("#loader").show();
		var id = jQuery(this).data('id');
		jQuery.ajax({
			url:'ws/travel/monibyte/'+id,	
			type:'GET', 	
			dataType: 'json'
		}).done(function( data ){
			var consulta = data.records;
			jQuery('#titulo_ver').text(consulta.usuario);
			jQuery("#tbl-ver").dataTable().fnClearTable();
			jQuery.each( consulta.movimientos, function( index,value ){

				var monto ='';
				var tipo ='';
				if( parseFloat(value.debito_inter) > 0.00){
					monto = value.moneda_simbolo+'. '+value.debito_inter;
					tipo = '<span class="label label-primary">Exterior</span>';
				}
				else{
					monto = value.moneda_simbolo+'. '+value.debito_local;
					tipo = '<span class="label label-default">Local</span>';
				}

				jQuery('#tbl-ver').dataTable().fnAddData([
	                (index+1),
	                monto,
	                tipo,
	                value.fecha_consumo,
	                '<span style="text-transform: capitalize;">'+value.detalles+'</span>',
	                '<span style="text-transform: capitalize;">'+value.rubro_id+'</span>',
	            ]);
			});
			jQuery("#loader").fadeOut();
		})
		.fail(function(error){console.log('error: ');console.log(error);})
	}

	function subir( e ){
		console.log("entro");
		jQuery('#loader').show();
		e.preventDefault();
		if( jQuery('#excel').val() )
		{	
			var datos_usuario = localStorage.USUARIO;
			jQuery('#usuario').val(datos_usuario);
			var formData = new FormData( jQuery('#form-subir')[0] );
			jQuery.ajax({
				type: 	'POST',
				url: 	'ws/travel/monibyte/subir',
				data: 	formData,
				async: false,
            	cache: false,
            	contentType: false,
            	processData: false,
			}).done(function( data ){

				if( data.result )
				{	
					BD_Cargar();
					jQuery('#modal-subir').modal('hide'); 
	                setTimeout( function(){ amigable(); }, 500);
	                if(data.records)
	                	toastr['success'](data.message, 'Éxito')
	                else
	                	toastr['success'](data.message, 'Éxito')

	                jQuery('#loader').fadeOut();
				}
				else
				{
					toastr['error'](data.message, 'Error');
					jQuery('#loader').fadeOut();
				}
			}).fail(function( err ){
				console.log( err );
				jQuery('#loader').fadeOut();
			});
			jQuery('#loader').fadeOut();
		}
		else
		{
			jQuery('#loader').fadeOut();
			toastr['error']('Hace falta el archivo de excel', 'Error');
		}
	}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->Funci end
};






