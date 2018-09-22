var idRegistro='';
var idEliminar='';


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

function BD_Cargar()
{//console.log('BD Cargada Exitosamente');
	
	window.tabla_BD.clear();
	//window.tabla_BD.draw();
	jQuery.ajax(
	{
		url:'ws/travel/cuentas',	
		type:'GET', 	
		dataType: 'json'
	})
	.done(function( data ){
		Informacion=data.records;		
		jQuery.each(data.records, function (index, valor) { 
			Col1='<center>'+(index+1)+'</center>';
			Col2=valor.nombre;
            Col3='<td>'+
                    '<a data-placement="top" title="Añadir o eliminar rubros" class="btn-ver btn btn-info btn-xs toltip" href="#modal-ver" data-toggle="modal" data-idregistro="'+valor.id+'"><i class="glyphicon glyphicon-list"></i></a> '+
                    '<a data-placement="top" title="Editar cuenta y rubros" style="margin-left: 5px;" class="btn-editar btn btn-primary btn-xs toltip" href="#modal-editar" data-toggle="modal" data-idregistro="'+valor.id+'"><i class="fa fa-pencil"></i></a>'+
                    '<a data-placement="top" title="Eliminar cuenta con sus rubros" style="margin-left: 5px;" class="btn btn-danger btn-xs btn-eliminar toltip" href="#modal-eliminar" data-toggle="modal" data-idregistro="'+valor.id+'"><i class="fa fa-trash-o "></i></a>'+
                '</td>';

			window.tabla_BD.row.add([Col1,Col2,Col3]).draw();
            //'<div class="tooltip-example"><button data-placement="top" data-toggle="tooltip"  class="btn-editar fa btn-sm fa-pencil btn-warning tooltips" data-id="'+valor.id+'" data-index="'+index+'"></button> <button data-placement="top" data-toggle="tooltip"  class="btn-eliminar fa btn-sm fa-minus btn-danger tooltips" data-id="'+valor.id+'" data-index="'+index+'"></button></div>';


		});
	})
	.fail(function(error){console.log('error: ');console.log(error);})
}


///////////////////////////////////////////////////////ABC/////////////////////////////////////////////////////////////////
jQuery('#crear').on('click',function(){
	jQuery('#form-crear')[0].reset();
	jQuery('#descripcion_nuevo').remove();
	jQuery('#detalles_nuevo').append("<div id='descripcion_nuevo'></div>");
});

var contar1=0;
jQuery('#masmen').on('click',function(e){
	e.preventDefault();
	jQuery('#descripcion_ver').append('<div class="div_ver_'+contar1+' divs_ver"><div class="form-group col-md-11"><input type="text" class="form-control descripcion_class_ver" required value="" /></div><div class="form-group col-md-1"><button class="btn btn-danger btn" data-id="'+contar1+'" id="elim-ver" ref="#modal-confirmar" data-toggle="modal">x</button></div></div><p></p>');
	contar1=contar1+1;
});

jQuery('#descripcion_ver').on('click','#elim-ver',function(e){
	e.preventDefault();
	idEliminar=jQuery(e.target).data('id');
	jQuery('#modal-confirmar').modal('show');
	jQuery('#modal-ver').modal('hide');


});

jQuery('#btn-eliminar-confirmar').on('click', function( e ){
	var coneli=0;
	jQuery('.descripcion_class_ver').each(function()
	{
		coneli=coneli+1;
		//console.log('contar: '+coneli);
	});
	if(coneli>1)
	{
		jQuery('.div_ver_'+idEliminar).remove();
	}
	else
	{
		toastr['warning']('Se necesita 1 descripcion como minimo', 'Espere');
	}
	jQuery('#modal-confirmar').modal('hide');
	jQuery('#modal-ver').modal('show');
});

jQuery('#btn-eliminar-negar').on('click', function( e ){
	e.preventDefault();
	jQuery('#modal-confirmar').modal('hide');
	jQuery('#modal-ver').modal('show');
});


jQuery('#detalles_nuevo').delegate('.elim_nuevo','click', eliminar_nuevo);
var contar=1;
jQuery('#mas').on('click',function(e){
	e.preventDefault();
	jQuery('#descripcion_nuevo').append('<div class="div_'+contar+'">'+
											'<div class="form-group col-md-11">'+
												'<input type="text" class="form-control descripcion_class" value="" />'+
											'</div>'+
											'<div class="form-group col-md-1">'+
												'<button class="elim_nuevo btn btn-danger btn" data-id="'+contar+'">'+
													'<i class="glyphicon glyphicon-remove"></i>'+
												'</button>'+
											'</div><p></p>'+
										'</div>');
	contar=contar+1;
});

	function eliminar_nuevo( e )
	{
		e.preventDefault();
		var eliminar = jQuery(this).data('id');
		jQuery('.div_'+eliminar).remove();
	}


jQuery('#btn-guardar').on('click',function(){
	var error=0;
	var descripciones = [];	
	jQuery('.descripcion_class_ver').each(function()
	{
		var contenido='';
		var objeto={};
		if(jQuery(this).text()) {	contenido=jQuery(this).text();	}
		else 					{	contenido=jQuery(this).val();	}
		if(contenido)
		{
			var objeto = {descripcion : contenido};
			descripciones.push(objeto);
		}
		else
		{
			error=1;
		}
	});
	var detalles = JSON.stringify(descripciones);
	if(error==0)
	{
		// console.log( 'detalles='+detalles+'&eliminar=Si: '+ idRegistro);
		jQuery.ajax(
		{

	        url:'ws/travel/cuentas/'+idRegistro,
				type:'PUT', 	
				dataType: 'json',
			    data:     'detalles='+detalles+'&eliminar=si',
		})
		.done(function( data ){
			//console.log(data);
			 if(data.result)
			 {
			 	toastr['success'](data.message, 'Éxito');
				jQuery('#modal-ver').modal('hide');
				setTimeout( function(){ BD_Cargar(); }, 500);
			 }
			 else
			 {
			 	//console.log(data);
			 	toastr['warning'](data.message, 'Espere');
			 }
		})
		.fail(function(error){
			console.log(error);
			toastr['warning'](error.message, 'Espere');
		})
	}
	else
	{
		toastr['warning']('no pueden haber descripciones vacias', 'Espere')
	}

});


var contar2=1;
jQuery('#mas_editar').on('click',function(e)
{
	e.preventDefault();
	jQuery('#descripcion_editar').append('<div id="div_'+contar2+'"><input id="descripcioneditar_'+contar2+'"type="text" class="form-control descripcion_editar" required name="descripcion"><button class="btn btn-danger btn" data-id="'+contar2+'" id="elim-des-editar"><i class="glyphicon glyphicon-remove"></i></button></div><p></p>')
	contar2=contar2+1;
});

jQuery('#descripcion_editar').on('click','#elim-des-editar',function(e)
{	
	//console.log("eliminar")
	e.preventDefault();
	var eliminar2= jQuery(e.target).data('id');
	jQuery('#div_'+eliminar2).remove();
});

jQuery('#btn-crear').on('click',function(){
	var error=0;
	if(jQuery('#nombre').val())
	{
		var descripciones = [];	
		jQuery('.descripcion_class').each(function()
		{
			if(jQuery(this).val().length)
			{
				var objeto = 
				{
						descripcion : jQuery(this).val()
				}
				descripciones.push(objeto);
			}
			else
			{
				//console.log('::'+jQuery(this).val());
				error=1;
			}
			
		});
		var detalle_desc = JSON.stringify(descripciones);
		if(error==0)
		{
			//console.log(detalle_desc);
			// console.log(jQuery('#nombre').val());
			jQuery.ajax(
			{
				url: 		'ws/travel/cuentas',
				type: 		'POST', 	
				dataType: 	'json',
		        data:       'detalles='+detalle_desc+'&nombre='+jQuery('#nombre').val(),
			})
			.done(function( data ){
				//console.log(data);
				 if(data.result)
				 {
				 	toastr['success'](data.message, 'Éxito');
					jQuery('#modal-crear').modal('hide');
					setTimeout( function(){ BD_Cargar(); }, 500);  
					jQuery('#descripcion').remove();
					jQuery('#detalles').append("<div id='descripcion'></div>");
				 }
				 else
				 {
				 	toastr['warning'](data.message, 'Espere');
				 }
			})
			.fail(function(error){
				toastr['warning'](error.message, 'Espere');
			})
			jQuery('#form-crear').each (function(){
			  this.reset();
			});
		}
		else
		{
			toastr['warning']('Una de las descripciones esta vacia', 'Espere');
		}
	}
	else
	{
		toastr['warning']('El nombre esta vacio', 'Espere');
	}
	
});
jQuery('#tabla-registros').on('click','a.btn-ver',function(e){	
	e.preventDefault();
	idRegistro = jQuery(this).data('idregistro');
	jQuery('.divs_ver').remove();
	//console.log(idRegistro);
	jQuery.ajax(
	{
		url:'ws/travel/cuentas/'+idRegistro,
		type:'GET', 	
		dataType: 'json'
	})
	.done(function( data ){
		//console.log(data.records);
		jQuery('#desc-nomb').text(data.records.nombre);
		idRegistro=data.records.id;
		// jQuery('#edit_descripcion').val(data.records.descripcion);
		jQuery.ajax(
		{
			url:'ws/travel/cuentas/detalles/'+idRegistro,
			type:'GET', 	
			dataType: 'json'
		})
		.done(function( data ){
			//console.log(data.records);
			contar1=0;
			jQuery.each(data.records, function (index,datos) { 
				jQuery('#descripcion_ver').append('<div class="div_ver_'+contar1+' divs_ver"><div class="form-group col-md-11"><label type="text" class="form-control descripcion_class_ver" required >'+datos.nombre+'</label></div><div class="form-group col-md-1"><button class="btn btn-danger btn" data-id="'+contar1+'" data-ide="'+datos.id+'" id="elim-ver">x</button></div></div><p></p>');
				//console.log(datos.nombre);
				contar1=contar1+1;
			});
		})
		.fail(function(error){
			toastr['warning'](error.message, 'Espere');
		})
	})
	.fail(function(error){
		toastr['warning'](error.message, 'Espere');
	})
});

jQuery('#tabla-registros').on('click','a.btn-editar',function(e){	
	e.preventDefault();
	idRegistro = jQuery(this).data('idregistro');
	jQuery('.div_edit').remove();
	//console.log(idRegistro);
	jQuery.ajax(
	{
		url:'ws/travel/cuentas/'+idRegistro,
		type:'GET', 	
		dataType: 'json'
	})
	.done(function( data ){
		//console.log(data.records);
		jQuery('#edit_nombre').val(data.records.nombre);
		// jQuery('#edit_descripcion').val(data.records.descripcion);
		jQuery.ajax(
		{
			url:'ws/travel/cuentas/detalles/'+idRegistro,
			type:'GET', 	
			dataType: 'json'
		})
		.done(function( data ){
			//console.log(data.records);
			jQuery.each(data.records, function (index,datos) { 
				jQuery('#descripcion_edit').append('<div class="div_edit"><input type="text" class="form-control descripcion_class_edit" required value="'+datos.nombre+'"><br></div>');
				//console.log(datos.nombre);
			});
		})
		.fail(function(error){
			toastr['warning'](error.message, 'Espere');
		})
	})
	.fail(function(error){
		toastr['warning'](error.message, 'Espere');
	})
});

jQuery('#btn-actualizar').on('click',function(){
	var descripciones = [];	
	var error=0;
	jQuery('.descripcion_class_edit').each(function()
	{
		if(jQuery(this).val().length)
		{
			var objeto = 
			{
					descripcion : jQuery(this).val()
			}
			descripciones.push(objeto);
		}
		else
		{
			//console.log('::'+jQuery(this).val());
			error=1;
		}
		
	});
	var detalle_desc = JSON.stringify(descripciones);

	if(jQuery('#edit_nombre').val())
	{
		if(error==0)
		{
			jQuery.ajax(
			{
				url:'ws/travel/cuentas/'+idRegistro,
				type:'PUT', 	
				dataType: 'json',
			    data:     'nombre='+jQuery('#edit_nombre').val()+'&detalles='+detalle_desc,
			})
			.done(function( data ){
				 //console.log(data.records);
				 if(data.result)
				 {
					toastr['success'](data.message, 'Éxito');
					jQuery('#modal-editar').modal('hide');
					setTimeout( function(){ BD_Cargar(); }, 500);   
				 }
				 else
				 {
				 	console.log(data);
					toastr['warning'](data.message, 'Espere');
				 }
			})
			.fail(function(error){
				 console.log(error);
				toastr['warning']("No se permite campo vacio", 'Espere');
			})
		}
		else
		{
			toastr['warning']("Ninguna descripcion debe de ir vacia", 'Espere');
		}
	}
	else
	{
		toastr['warning']("El nombre esta vacio", 'Espere');
	}
});

jQuery('#tabla-registros').on('click', 'a.btn-eliminar', function( e )
{
    e.preventDefault();
    idEliminar = jQuery(this).data('idregistro');
});

jQuery('#btn-eliminar').on('click', function(){
	//console.log(idEliminar);
	jQuery.ajax(
	{
		url:'ws/travel/cuentas/'+idEliminar,
		type:'DELETE', 	
		dataType: 'json',
	})
	.done(function( data ){
		toastr['success'](data.message, 'Éxito');
		BD_Cargar();
		jQuery('#modal-eliminar').modal('hide');
	})
	.fail(function(error){
		toastr['warning'](error.message, 'Espere');
	})
});






