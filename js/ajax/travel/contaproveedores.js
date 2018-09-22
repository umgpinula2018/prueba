var conteo = 0;

jQuery(document).ready(iniciar); 
function iniciar()
{
	console.log( 'cargo la pagina' );
	window.tabla_BD = jQuery('#tabla-registros').DataTable(
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
    BD_Cargar();
	jQuery("#loader").fadeOut();
}

function llenarSociedades(objeto,contenido){
        jQuery('.sociedades').remove();
        jQuery('#loader').show();
        jQuery.ajax({
            url:        'ws/sociedades/lista',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result ){
                cont = 0;
                jQuery.each( data.records.TI_SOC.item, function( index,valor ){
                    if( contenido==valor.BUKRS )
                        jQuery('#'+objeto).append('<option class="sociedades" selected="selected" value="'+valor.BUKRS+'">'+valor.BUKRS+' ('+valor.BUTXT+')</option>');
                    else
                        jQuery('#'+objeto).append('<option class="sociedades" value="'+valor.BUKRS+'">'+valor.BUKRS+' ('+valor.BUTXT+')</option>');
                });

                //Estilos
                jQuery('.enabled').css( 'cursor', 'pointer' );
                jQuery('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log(err);
        }).always( function(){
            jQuery("#loader").fadeOut();
        });     
    }

function BD_Cargar()
{//console.log('BD Cargada Exitosamente');
	jQuery('#loader').show();
	window.tabla_BD.clear().draw();	
	conteo=0;
	jQuery.ajax({
        type:       'POST',
        url:        'ws/vsociedadusuario',
        dataType:   'json',
        data: 		{user: localStorage.USUARIO},
    })
    .done(function(data){
        if( data.result )
        {
        	// console.log(data.records.SOCIEDAD);
        	jQuery('.sociedad').text(data.records.SOCIEDAD);
        	jQuery('.sociedad').val(data.records.SOCIEDAD);
            jQuery.ajax({
				url:'ws/travel/contabilidad/listar',	
				type:'POST', 	
				dataType: 'json',
				data: {sociedad:data.records.SOCIEDAD},
			}).done(function( data ){
				var consulta=data.records;
				if((consulta.length) ==0)
					jQuery('#loader').hide();	
				jQuery.each(consulta, function (index, valor) { 
					conteo=1;
					Col1=valor.sociedad;
					Col3=valor.tipo_doc;
					Col4=valor.acreedor;
					Col5=valor.bloqueo;
					Col2=valor.conta_proveedor;
					Col13=valor.conta_gasto;
					Col6=valor.iva_clave;
					Col7=valor.iva_cnta;
					Col8=valor.ret_clave;
					Col9=valor.ret_cnta;
					Col10=valor.isr_clave;
					Col11=valor.isr_cnta;
		            Col12='<td>'+
		                    '<a data-placement="top" title="Editar el proveedor" style="margin-left: 5px;" class="btn-editar btn btn-primary btn-xs toltip" href="#modal-editar" data-toggle="modal" data-id="'+valor.id+'"><i class="fa fa-pencil"></i></a>'+
		                    '<a data-placement="top" title="Eliminar el proveedor" style="margin-left: 5px;" class="btn btn-danger btn-xs btn-eliminar toltip" href="#modal-eliminar" data-toggle="modal" data-id="'+valor.id+'"><i class="fa fa-trash-o "></i></a>'+
		                '</td>';

					window.tabla_BD.row.add([Col1,Col3,Col4,Col5,Col2,Col13,Col6,Col7,Col8,Col9,Col10,Col11,Col12]).draw();
					jQuery('#loader').hide();
				});

			})
			.fail(function(error){console.log('error: ');console.log(error);})
        }
        else{
        	jQuery('#loader').hide();
            toastr['error'](data.message, 'Error');
        }
    }).fail(function(err){
        console.log('Pais no se detectó');
        jQuery('#loader').hide();
    });


			
}
///////////////////////////////////////////////////////ABC/////////////////////////////////////////////////////////////////
jQuery('#crear').on('click',function(){
	jQuery('.limpiar-nuevo').text('');
	jQuery('.limpiar-nuevo').val('');
	llenarSociedades('sociedadn','');
	// if(conteo>0)
	// 	toastr['warning']('Solo se permite 1 proveedor por sociedad', 'Cuidado');
	// else{
		jQuery('#modal-crear').modal('show');
	// }
});

jQuery('#tabla-registros').on('click','.btn-editar',function(){
	var id = jQuery(this).data('id');
	jQuery.ajax({
        type:       'POST',
        url:        'ws/travel/contabilidad/buscar',
        dataType:   'json',
        data: 		{id: id},
    })
    .done(function(data){
    	var consulta=data.records;
    	jQuery('#id').val(id);
    	llenarSociedades('sociedadm',consulta.sociedad);
    	// jQuery('#sociedadm').val(consulta.sociedad);
		jQuery('#tipo_docm').val(consulta.tipo_doc);
		jQuery('#acreedorm').val(consulta.acreedor);
		jQuery('#bloqueom').val(consulta.bloqueo);
		jQuery('#conta_proveedorm').val(consulta.conta_proveedor);
		jQuery('#conta_gastom').val(consulta.conta_gasto);
		jQuery('#iva_clavem').val(consulta.iva_clave);
		jQuery('#iva_cntam').val(consulta.iva_cnta);
		jQuery('#ret_clavem').val(consulta.ret_clave);
		jQuery('#ret_cntam').val(consulta.ret_cnta);
		jQuery('#isr_clavem').val(consulta.isr_clave);
		jQuery('#isr_cntam').val(consulta.isr_cnta);
    }).fail(function(err){
    	console.log(err);
    	toastr['warning'](data.message, 'Espere');
    })
});

jQuery('#tabla-registros').on('click','.btn-eliminar',function(){
	var id = jQuery(this).data('id');
	jQuery('#id_eliminar').val(id);
});

jQuery('#btn-eliminar').on('click',function(){
	jQuery.ajax(
	{
		url: 		'ws/travel/contabilidad/eliminar',
		type: 		'POST', 	
		dataType: 	'json',
        data:       {id:jQuery('#id_eliminar').val()},
	})
	.done(function( data ){
		 if(data.result){
		 	conteo=0;
		 	jQuery('#loader').hide();
		 	toastr['success'](data.message, 'Éxito');
			jQuery('#modal-eliminar').modal('hide');
			BD_Cargar();
		 }else{
		 	toastr['warning'](data.message, 'Espere');
		 	jQuery('#loader').hide();
		 }
	})
	.fail(function(error){
		toastr['warning'](error.message, 'Espere');
		jQuery('#loader').hide();
	})
});

jQuery('#btn-crear').on('click', function(e){
	e.preventDefault();
	if( jQuery('#form-crear').valid() ){
		jQuery.ajax(
		{
			url: 		'ws/travel/contabilidad/crear',
			type: 		'POST', 	
			dataType: 	'json',
	        data:       jQuery('#form-crear').serialize()
		})
		.done(function( data ){
			 if(data.result){
			 	jQuery('#loader').hide();
			 	conteo=0;
			 	toastr['success'](data.message, 'Éxito');
				jQuery('#modal-crear').modal('hide');
				BD_Cargar();
			 }else{
			 	console.log(data.message);
			 	toastr['warning'](data.message, 'Espere');
			 	jQuery('#loader').hide();
			 }
		})
		.fail(function(error){
			toastr['warning']('Ya existe una sociedad con el mismo nombre', 'Espere');
			jQuery('#loader').hide();
		})
	}else{
		toastr['warning']('Hace falta datos por llenar', 'Espere');
	}	
});

jQuery('#btn-actualizar').on('click', function(e){
	e.preventDefault();
	console.log( jQuery('#form-editar').serialize() );
	if( jQuery('#form-crear').valid() ){
		jQuery.ajax(
		{
			url: 		'ws/travel/contabilidad/modificar',
			type: 		'POST', 	
			dataType: 	'json',
	        data:       jQuery('#form-editar').serialize()
		})
		.done(function( data ){
			 if(data.result){
			 	jQuery('#loader').hide();
			 	conteo=0;
			 	toastr['success'](data.message, 'Éxito');
				jQuery('#modal-editar').modal('hide');
				BD_Cargar();
			 }else{
			 	console.log(data.message);
			 	toastr['warning'](data.message, 'Espere');
			 	jQuery('#loader').hide();
			 }
		})
		.fail(function(error){
			toastr['warning'](error.message, 'Espere');
			jQuery('#loader').hide();
		})
	}else{
		toastr['warning']('Hace falta datos por llenar', 'Espere');
	}	
});



