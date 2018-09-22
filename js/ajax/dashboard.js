jQuery( document ).ready( function( $ )
{
	window.tabla = $('.datatable').dataTable({
		'iDisplayLength': 5,
		"lengthMenu": [[5, 10], [5, 10]],
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

	window.tabla = $('.datatable2').dataTable(
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

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

	llenarDatos();

	function llenarDatos()
	{
		$("#loader").show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/estadisticas/mostrardatos',
			dataType: 	'json'
		})
		.done(function( data )
		{
			if( data.result )
			{
				cont1 = 1; cont2 = 1;
				$.each(data.records.ingresos, function(index, value)
	            {
	            	$("#tabla-ingresos").dataTable().fnAddData([ 
	            		cont1++,
	            		value.app.toUpperCase(),
	            		value.movil,
	            		value.web
					]);
	            });

	            $.each(data.records.liberaciones, function(index, value)
	            {
	            	$("#tabla-liberaciones").dataTable().fnAddData([ 
	            		cont2++,
	            		value.app.toUpperCase(),
	            		value.movil,
	            		value.web
					]);
	            });
			}
		})
		.fail( function( err )
		{
			console.log(err);
		})
		.always(function(){	});

		// Llenar datos de información de moviles
		$.ajax(
		{
			type: 	'GET',
			url: 	'ws/parametros/informacion/dashboard',
		})
		.done(function( result )
		{
			if( result.result )
			{
				$('#dispositivos').text(result.records.dispositivos+' dispositivos utilizando el app');
				$('#usuarios').attr('data-value',result.records.usuarios);
				$('#usuarios2').text(result.records.usuarios);
				$('#android').attr('data-value',result.records.android);
				$('#ios').attr('data-value',result.records.ios);
				$('#linear').attr('data-data',[result.records.linear_todos]);

				/* GRAFICA DE OCEANO */
			    var data_todos = [];
			    var todos=[];
			    var cont=0;
				$.each(result.records.linear, function (ind, val) 
				{
					todos.push(cont,val.item);
					data_todos.push(todos);
					todos = [];
					cont++;
				});

				dataOcean = [{data: data_todos, label: "Inicios de sesión", lines: {show: true, fill: 0.8, lineWidth: 0 } }];
			    options = {legend: {position: "nw", noColumns: 1, container: jQuery("#ocean-flot-legend") }, grid: {hoverable: true, borderWidth: {top: 0, right: 0, bottom: 0, left: 0 }, clickable: false, borderColor: "#000", margin: {top: 10, right: 10, bottom: 0, left: 10 }, minBorderMargin: 1, labelMargin: 0, mouseActiveRadius: 30, backgroundColor: {colors: ["#fff", "#fff"] } }, series: {stack: true, shadowSize: 0, curvedLines: {apply: true, active: true, monotonicFit: true } }, xaxis: {show: true, color: '#eee', ticks: false }, yaxis: {tickLength: 0, ticks: false }, tooltip: {show: true, cssClass: "MainFlotTip", content: '<h5>%s</h5>' + "Usuarios: %y"}, colors: ["#69B36C"] }
			    var chart = jQuery.plot(jQuery("#ocean-flot"), dataOcean, options);
			    $('body').animate({scrollTop: 1 }, 1000);
			}
			else
				toastr['error'](result.message, 'Error');
		})
		.fail( function( err )
		{
			console.log(err);
		})
		.always(function()
		{
			$('#loader').fadeOut();
		});
	}

	$('#btn-enviar-individual').on('click',function( e )
	{
		e.preventDefault();
        var android = $("#enviar_android").prop('checked')?'1':'0';
        var ios = $("#enviar_ios").prop('checked')?'1':'0';
        console.log({mensaje: $("#mensaje_individual").val(),ios:ios, android: android});
        $.getJSON('ws/dispositivos/pushindividual', {mensaje: $("#mensaje_individual").val(),email:$("#email_individual").val()}, function(json, textStatus) 
        {
            console.log(json); 
            var n = noty({
                text: '<div class="activity-item"> <i class="fa fa fa-thumbs-up text-success"></i> <div class="activity"> '+json.mensaje+' </div> </div>',
                type: "success",
                dismissQueue: true,
                layout: "topRight",
                closeWith: ['click'],
                theme: 'MatMixNoty',
                maxVisible: 10,
                animation: {
                    open: 'noty_animated bounceInRight',
                    close: 'noty_animated bounceOutRight',
                    easing: 'swing',
                    speed: 500
                }
            });

           setTimeout(function () { n.close(); }, 3000);
           $('#mensaje_individual').val('');
           $('#email_individual').val('');
        });
    });

    $('#btn-enviar-general').on('click',function( e )
    {
    	e.preventDefault();
        var android = $("#enviar_android").prop('checked')?'1':'0';
        var ios = $("#enviar_ios").prop('checked')?'1':'0';
        $.getJSON('ws/dispositivos/pushgeneral', {mensaje: $("#mensaje").val(),ios:ios, android: android}, function(json, textStatus) 
        {
            console.log(json);
            var n = noty({
                text: '<div class="activity-item"> <i class="fa fa fa-thumbs-up text-success"></i> <div class="activity"> '+json.mensaje+' </div> </div>',
                type: "success",
                dismissQueue: true,
                layout: "topRight",
                closeWith: ['click'],
                theme: 'MatMixNoty',
                maxVisible: 10,
                animation: {
                    open: 'noty_animated bounceInRight',
                    close: 'noty_animated bounceOutRight',
                    easing: 'swing',
                    speed: 500
                }

            });
            setTimeout(function () { n.close(); }, 3000);
            $('#mensaje').val('');
       });
    });


    
});