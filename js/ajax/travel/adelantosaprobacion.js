

jQuery(document).ready(iniciar);
function iniciar()
{
	window.tabla_BD = jQuery('#tabla-registros').DataTable(
		{
		"aaSorting":[[0,"desc"]],
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

	var Cantidad=0;
	BD_Cargar();
	jQuery("#loader").fadeOut();
}

function BD_Cargar(){//console.log('BD Cargada Exitosamente');
	window.tabla_BD.clear().draw();
	jQuery.ajax({
		url:'ws/travel/adelanto/aprobados',	
		type:'POST', 	
		dataType: 'json',
		data: { email: localStorage.USUARIO},
	})
	.done(function( data ){
		Informacion=data.records;		
		//console.log( Informacion );
		jQuery.each(data.records, function (index, valor) { 
			Col1='<center>'+valor.correlativo+'</center>';
			Col2=valor.nombre_usuario;
			Col3=valor.email_usuario;
			Col4=valor.sociedad;
			Col5='<center>'+valor.centro_costo_numero+'</center>';
			Col6=valor.justificacion;
			var Moneda='';	
			switch(valor.tipo_moneda)
			{
				case '0': 		Moneda='$ ';		break;
				case '1': 		Moneda='₡ ';		break;
				case '2': 	Moneda='Q ';		break;
			}
			separador_miles_decimales(valor.monto);
			Col7=Moneda+'<strong>'+parseFloat(Cantidad).toFixed(2)+'</strong>';
			Col8=formato_fecha(valor.fecha_entrega);
			// valor.prioridad==1?Col9='<center><span class="fa fa-check-square-o"></span></center>':Col9='<center><span class="fa fa-square-o"></span></center>';		
			Col10='<center><span class="label label-info">Aprobado</span></center>';
			Col11='<td>'+
                '<a data-placement="top" title="Completar" class="toltip btn-aprobar btn btn-success btn-xs" href="#modal-completar" data-toggle="modal" data-idregistro="'+valor.id+'"><i class="glyphicon glyphicon-ok"></i> Completar</a>'+
            '</td>';
			window.tabla_BD.row.add([Col1,Col2,Col3,Col4,Col5,Col6,Col7,Col8,/*Col9,*/Col10,Col11]).draw();
		});
	})
	.fail(function(error){console.log('error: ');console.log(error);})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------>FUNCIONES
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
function separador_miles_decimales(id){
    var valor=id.toString();
    //console.log(valor);
    var valor=valor.replace(/,/gi, " ");
    Cantidad=generador.call(valor.split(' ').join(''),' ','.');
}
function generador(comma, period) {
    comma = comma || ',';
    period = period || '.';
    var split = this.toString().split('.');
    var numeric = split[0];
    var decimal = split.length > 1 ? period + split[1] : '';
    var reg = /(\d+)(\d{3})/;
    while (reg.test(numeric)) 
    {
        numeric = numeric.replace(reg, '$1' + comma + '$2');
    }
    /*body = a.toFixed(2);  */
    var total=0;
    if(decimal.length>1)
    {
        if(decimal.length>3){
            decimal_pruebas=parseFloat(decimal);
            decimal_pruebas = decimal_pruebas.toFixed(2);
            decimal_pruebas >=1?decimal_pruebas = 0.99 :decimal_pruebas=decimal_pruebas;
            decimal_pruebas = decimal_pruebas.toString();
            decimal= decimal_pruebas.replace(/0./gi, ".");
            //console.log(decimal_pruebas);
        }
        numeric=numeric.replace(/ /gi, ",");
        total=numeric+decimal;
    }else{
        numeric=numeric.replace(/ /gi, ",");
        total=numeric+decimal;
    }
    return total;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------->BOTONES
jQuery('#tabla-registros').on('click','a.btn-aprobar',function(e){	
	e.preventDefault();
	idRegistro = jQuery(this).data('idregistro');
	jQuery("#loader").show();
	jQuery.ajax(
	{
		url:'ws/travel/solicitud/adelanto/'+idRegistro,
		type:'GET', 	
		dataType: 'json',

	})
	.done(function( data ){
		var tipo='';
		jQuery('#form-aprobar').each (function(){
		  this.reset();
		});
		jQuery('#nombre').val(data.records.nombre_usuario);
		jQuery('#motivo').val(data.records.justificacion);
		jQuery('#monto').val(parseInt(data.records.monto).toFixed(2));
		jQuery('#tipo_moneda').val(data.records.tipo_moneda);
		jQuery('#empid').val(localStorage.EMPID);
		switch( data.records.tipo_moneda ){
			case '0' : tipo = '$.'; break;
			case '1' : tipo = '₡.'; break;
			case '2' : tipo = 'Q.'; break;
		}
		jQuery('#moneda').text(tipo);
	})
	.fail(function(error){
		toastr['warning'](error.message, 'Espere');
	})
	.always( function(){
			jQuery("#loader").fadeOut();
	});	
	jQuery('#form-registros').each (function(){
	  this.reset();
	});
});

jQuery('#tabla-registros').on('click','a.btn-rechazar',function(e){	
	e.preventDefault();
	idRegistro = jQuery(this).data('idregistro');
	jQuery('#form-rechazar').each (function(){
	  this.reset();
	});
});

jQuery('#btn-aprobacion-rechazar').on('click',function(e){
	e.preventDefault();
	if(jQuery('#comentario_rechazada').val())
	{
		jQuery('#modal-rechazar').modal('hide');
		jQuery("#loader").show();
		jQuery.ajax(
		{
			url:'ws/travel/solicitud/adelanto/'+idRegistro,
			type:'PUT', 	
			dataType: 'json',
			data: jQuery('#form-rechazar').serialize(),
		})
		.done(function( data ){
			if(data.result)
			{
				//console.log(data.records);
				BD_Cargar();
				jQuery("#loader").fadeOut();
				toastr['success']('La solicitud ha sido rechazada', 'Éxito');
			}
			else
			{
				jQuery("#loader").fadeOut();
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
		toastr['warning']('Hace falta el comentario','Espere');
	}
});

jQuery('#btn-aprobacion-aceptar').on('click',function(e){
	e.preventDefault();
	jQuery('#modal-aprobar').modal('hide');
	jQuery('#loader').show();
	jQuery('#id').val(idRegistro);

	//console.log( jQuery('#form-aprobar').serialize() )

	jQuery.ajax({
		url:'ws/travel/adelantoaprobacion',
		type:'POST', 	
		dataType: 'json',
		data: jQuery('#form-aprobar').serialize(),
	})
	.done(function( data ){
		//console.log( data );
		if(data.result)
		{
			//console.log(data.records);
			BD_Cargar();
			jQuery('#priorida').removeAttr('checked');
			jQuery('#fecha').val('');
			jQuery("#loader").fadeOut();
			toastr['success']('La solicitud ha sido aprobada', 'Éxito');
		}
		else
		{
			jQuery("#loader").fadeOut();
			toastr['warning'](data.message, 'Espere');
			//console.log(data);
		}
	})
	.fail(function(error){
		toastr['error']('Ocurrió un error','Espere');
		console.log(error);
		jQuery("#loader").fadeOut();
	})
});

jQuery('#btn-aprobacion-completar').on('click',function(e){
	e.preventDefault();
	jQuery('#modal-completar').modal('hide');
	jQuery('#loader').show();
	jQuery('#id').val(idRegistro);

	//console.log( jQuery('#form-completar').serialize() )

	jQuery.ajax({
		url:'ws/travel/adelanto/sap',
		type:'POST', 	
		dataType: 'json',
		data: {id:idRegistro},
	})
	.done(function( data ){
		//console.log( data );
		if(data.result)
		{
			//console.log(data.records);
			BD_Cargar();
			jQuery('#priorida').removeAttr('checked');
			jQuery('#fecha').val('');
			jQuery("#loader").fadeOut();
			toastr['success']('La solicitud ha sido aprobada', 'Éxito');
		}
		else
		{
			jQuery("#loader").fadeOut();
			toastr['warning'](data.message, 'Espere');
			//console.log(data);
		}
	})
	.fail(function(error){
		toastr['error']('Ocurrió un error','Espere');
		console.log(error);
		jQuery("#loader").fadeOut();
	})
});

jQuery('#priorida').on('click',function(e){
	if( jQuery('#priorida').prop('checked') ) 
	{
		jQuery('#prioridad').val('1');
	}
	else
	{
		jQuery('#prioridad').val('0');
	}
});