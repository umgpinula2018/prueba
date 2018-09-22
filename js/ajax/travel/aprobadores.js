var idRegistro='';
var idEliminar='';


jQuery(document).ready(iniciar); 
function iniciar()
{
	jQuery('#loader').show();
	//console.log( 'cargo la pagina' );
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

function BD_Cargar()
{//console.log('BD Cargada Exitosamente');
	
	window.tabla_BD.clear();
	//window.tabla_BD.draw();
	jQuery.ajax(
	{
		url:'ws/travel/Autorizacion/listar',	
		type:'POST', 	
		dataType: 'json',
		data: {email: localStorage.USUARIO},
	})
	.done(function( data ){
		var consulta=data.records;		
		jQuery.each(data.records, function (index, valor) { 
			Col1='<center>'+(index+1)+'</center>';
			Col2=valor.nombre_autorizado;
			Col3=valor.email_autorizado;
			Col6='';
			if(valor.solicitud == 'true')
				Col6 = '<span style="font-size: 0.9em;width: 100%;" class="label label-primary">Solicitud</span>';
			if(valor.aprobacion == 'true')
				Col6 = Col6+' <span style="font-size: 0.9em;width: 100%;" class="label label-primary">Aprobación</span>';
			if( !Col6 )
				Col6 = '<span style="font-size: 0.9em;width: 100%;" class="label label-warning">Sin permisos</span>';

			if( valor.estado == 1 ){
				Col4='<span style="font-size: 0.9em;width: 100%;" class="label label-default">Activo</span>';
				Col5='<td>'+
	                    '<a data-placement="top" title="Modificar los permisos" style="margin-left: 5px;" class="btn btn-success btn-xs btn-ver toltip" href="#modal-ver" data-toggle="modal" data-correo="'+valor.email_autorizado+'" data-idregistro="'+valor.id+'"><i class="fa fa-pencil "> Modificar</i></a>'+
	                    '<a data-placement="top" title="Desactivar la Cuenta" style="margin-left: 5px;" class="btn btn-info btn-xs btn-eliminar toltip" href="#modal-eliminar" data-toggle="modal" data-correo="'+valor.email_autorizado+'" data-idregistro="'+valor.id+'"><i class="fa fa-retweet "> Desactivar</i></a>'+
	                '</td>';
			}
            else{
				Col4='<span style="font-size: 0.9em;width: 100%;" class="label label-default">Inactivo</span>';
				Col5='<td>'+
	                    '<a data-placement="top" title="Modificar los permisos" style="margin-left: 5px;" class="btn btn-success btn-xs btn-ver toltip" href="#modal-ver" data-toggle="modal" data-correo="'+valor.email_autorizado+'" data-idregistro="'+valor.id+'"><i class="fa fa-pencil "> Modificar</i></a>'+
	                    '<a data-placement="top" title="Reactivar la cuenta" style="margin-left: 5px;" class="btn btn-info btn-xs btn-eliminar toltip" href="#modal-eliminar" data-toggle="modal" data-correo="'+valor.email_autorizado+'" data-idregistro="'+valor.id+'"><i class="fa fa-retweet"> Reactivar</i></a>'+
	                '</td>';
            }
			window.tabla_BD.row.add([Col1,Col2,Col3,Col6,Col4,Col5]).draw();
            //'<div class="tooltip-example"><button data-placement="top" data-toggle="tooltip"  class="btn-editar fa btn-sm fa-pencil btn-warning tooltips" data-id="'+valor.id+'" data-index="'+index+'"></button> <button data-placement="top" data-toggle="tooltip"  class="btn-eliminar fa btn-sm fa-minus btn-danger tooltips" data-id="'+valor.id+'" data-index="'+index+'"></button></div>';
            jQuery('#loader').hide();

		});
		//console.log(data.records);
	})
	.fail(function(error){console.log('error: ');console.log(error);})
}


///////////////////////////////////////////////////////ABC/////////////////////////////////////////////////////////////////
jQuery('#tabla-registros').on('click', '.btn-eliminar', function( e ){
	e.preventDefault();
	jQuery('#loader').show();
	var id=jQuery(this).data('idregistro');
	var correo=jQuery(this).data('correo');
	jQuery('loader').show();
	jQuery.ajax({
		url: 		'ws/travel/Autorizacion/eliminar',
		type: 		'POST', 	
		dataType: 	'json',
        data:       {id: id},
	})
	.done(function( data ){
		if(data.result){
			jQuery('#loader').fadeOut();
			toastr['success'](data.message, 'Éxito');
			jQuery('#modal-editar').modal('hide');
			BD_Cargar();
		}else{
			jQuery('#loader').fadeOut();
			toastr['warning'](data.message, 'Espere');
		}
	}).fail(function(error){
		jQuery('#loader').fadeOut();
		toastr['warning']('El correo ingresado es incorrecto', 'Espere');
	});
});

jQuery('#crear').on('click', function( e ){
	e.preventDefault();
	jQuery('#correon').val('');
	jQuery('.permisos').val('false');
});

jQuery('#tabla-registros').on('click', '.btn-ver', function( e ){
	e.preventDefault();
	jQuery('#loader').show();
	var id=jQuery(this).data('idregistro');
	jQuery('.permisos').val('false');
	jQuery.ajax({
		url: 		'ws/travel/Autorizacion/busqueda',
		type: 		'POST', 	
		dataType: 	'json',
        data:       {id: id},
	})
	.done(function( data ){
		if(data.result){
			jQuery('#emailm').text(data.records.email_autorizado);
			jQuery('#solicitudm').val(data.records.solicitud);
			jQuery('#aprobacionm').val(data.records.aprobacion);
			jQuery('#id').val(id);
			jQuery('#loader').fadeOut();
			BD_Cargar();
		}else{
			jQuery('#loader').fadeOut();
			toastr['warning'](data.message, 'Espere');
		}
	}).fail(function(error){
		console.log(error)
		jQuery('#loader').fadeOut();
		toastr['warning'](error.message, 'Espere');
	});
});

jQuery('#btn-actualizar').on('click',function(e){
	e.preventDefault();
	jQuery('#loader').show();
	jQuery.ajax({
		url: 		'ws/travel/Autorizacion/actualizar',
		type: 		'POST', 	
		dataType: 	'json',
        data:       {id: jQuery('#id').val(),solicitud: jQuery('#solicitudm').val(),aprobacion: jQuery('#aprobacionm').val()},
	})
	.done(function( data ){
		if(data.result){
			toastr['success']('Se creó exitosamente su aprobador', 'Éxito');
			jQuery('#modal-ver').modal('hide');
			jQuery('#loader').fadeOut();
			BD_Cargar();
		}else{
			jQuery('#loader').fadeOut();
			toastr['warning'](data.message, 'Espere');
		}
	}).fail(function(error){
		console.log(error)
		jQuery('#loader').fadeOut();
		toastr['warning'](error.message, 'Espere');
	});
		
});

jQuery('#btn-crear').on('click',function(e){
	e.preventDefault();
	jQuery('#loader').show();
	if( jQuery('#correon').val() ){
		jQuery.ajax({
			url: 		'ws/travel/Autorizacion/crear',
			type: 		'POST', 	
			dataType: 	'json',
	        data:       {email_jefe: localStorage.USUARIO, email_autorizado:jQuery('#correon').val(),aprobacion: jQuery('#aprobacion').val(),solicitud: jQuery('#solicitud').val()},
		})
		.done(function( data ){
			if(data.result){
				toastr['success']('Se creó exitosamente su aprobador', 'Éxito');
				jQuery('#modal-crear').modal('hide');
				jQuery('#loader').fadeOut();
				BD_Cargar();
			}else{
				jQuery('#loader').fadeOut();
				toastr['warning'](data.message, 'Espere');
			}
		}).fail(function(error){
			console.log(error)
			jQuery('#loader').fadeOut();
			toastr['warning'](error.message, 'Espere');
		});
	}else{
		toastr['warning']('El correo es invalido', 'Espere');
		jQuery('#loader').fadeOut();
	}
		
});



