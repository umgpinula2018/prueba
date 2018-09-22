jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	window.tablaRegistros = $('#tabla-registros').DataTable(
	{
		"scrolX":true,
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

	function llenarTabla()
	{
		$('#loader').show();
		window.tablaRegistros.clear().draw();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/presupuestos/solicitudes',
			dataType: 	'json',
			data: 		{ email:$('#email_usuario').val() },
			success: function( data )
			{
				if( data.result )
				{
					cont = 0; estado = ''; acciones = '';
					$.each(data.records, function(index, value)
					{
						if(value.estado == 0)
						{
		            		estado = '<span class="label label-warning">Pendiente</span>';
		            		acciones =  '<td>'+
											'<a class="btn btn-primary btn-xs btn-detalle" href="#modal-detalle" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-list-alt"></i></a>'+
										'</td>';
						}
		            	else if(value.estado == 1)
		            	{
		            		estado = '<span class="label label-success">Aprobado</span>';
		            		acciones = '';
		            	}
		            	else if(value.estado == 2)
		            	{
		            		estado = '<span class="label label-danger">Rechazada</span>';
		            		acciones = '';
		            	}
		            	else if(value.estado == 3)
		            	{
		            		estado = '<span class="label label-info">Incompleta</span>';
		            		acciones =  '<td>'+
											'<a class="btn btn-primary btn-xs btn-detalle" href="#modal-detalle" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-list-alt"></i></a>'+
											'<a class="btn btn-success btn-xs btn-aprobar" style="margin:3px;" href="#modal-confirmarManual" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-check-square-o"></i></a>'+
										'</td>';
		            	}

						col1 = ++cont;
						col2 = value.usuario_solicitante;
						col3 = value.ceco_emisor;
						col4 = value.ceco_receptor;
						col5 = value.cuenta_receptora;
						col6 = value.periodo_receptor;
						col7 = '$. '+value.monto_total;
						col8 = value.comentario;
						col9 = value.fecha;
						col10 = estado;
						col11 = acciones;
						window.tablaRegistros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11]).draw(false);
					});
					$('#loader').fadeOut();
				}
				else
				{
					console.log( data.message );
					$('#loader').fadeOut();
				}
			},
			error: function( err )
			{
				console.log( err );
			}
		});
	}

	$("#tabla-registros").on('click','a.btn-detalle', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/presupuestos/solicitudes/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            var monto = 0;
		            contador =  0;
		            $('#tabla-detalle > tbody').empty();
		            $.each(result.records.detalle, function(index, value)
		            {
		            	monto = monto+parseFloat(value.monto);
		            	contador++;
		            	if(value.estado == 0)
		            		 $Etiqueta = '<span class="label label-warning">Pendiente</span>';
		            	else if(value.estado == 1)
		            		 $Etiqueta = '<span class="label label-success">Aprobado</span>';
		            	else if(value.estado == 2)
		            		 $Etiqueta = '<span class="label label-danger">Error</span>';
		            	
	            	    $('<tr/>') 
                            .append("<td>"+contador+"</td>")
                            .append('<td><input type="text" class="periodo_emisor" data-id="'+value.id+'" class="form-control" required name="periodoe" value="'+value.periodo_emisor+'"></td>')
                            .append('<td><input type="text" class="cuenta_emisora" data-id="'+value.id+'" class="form-control" required name="cuentae"  value="'+value.cuenta_emisora+'"></td>')
                            .append('<td>'+'$. '+numberWithCommas(value.monto)+'</td>')
                            .append('<td>'+$Etiqueta+'</td>')
                            .append('<td>'+value.texto_resultado+'</td>')
                            .appendTo("#tabla-detalle");
		            });

		            $("#form-detalle #cecoe").val(result.records.ceco_emisor);
		            $("#form-detalle #cecor").val(result.records.ceco_receptor);
		            $("#form-detalle #cuentar").val(result.records.cuenta_receptora);
		            $("#form-detalle #periodor").val(result.records.periodo_receptor);
		            $("#form-detalle #usuario").val(result.records.usuario_solicitante);
		            $("#form-detalle #comentario").val(result.records.comentario);
		            $("#form-detalle #monto").val('$. '+numberWithCommas(monto));
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-detalle").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#btn-rechazar').on('click', function( e )
	{
		e.preventDefault();
		$('#loader').show();
		$.ajax(
		{
	        type: 	'POST',
	        url : 	'ws/presupuestos/respondersolicitud',
	        data: 	{ aprobado:0, idregistro:idregistro },
	        success : function( result )
        	{
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito');
	            	$("#modal-detalle").modal('hide'); 
	            	setTimeout( function(){ amigable(); }, 500);
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-detalle").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#btn-aprobar').on('click', function( e )
	{
		e.preventDefault();
		$('#loader').show();
		var datos = [];
            
        $("#tabla-detalle > tbody > tr").each( function( i )
        { 
            var registro  = {}; 
            registro.id      		= parseInt($(this).find('td').find('.periodo_emisor').data('id'));
            registro.periodo_emisor = parseInt($(this).find('td').find('.periodo_emisor').val()); 
            registro.cuenta_emisora = parseInt($(this).find('td').find('.cuenta_emisora').val()); 
            datos.push( registro );
        });  

		var json = (JSON.stringify( datos ) );  
		var periodo_receptor = $("#form-detalle #periodor").val();
		var aprobado = 1;  
            
		$.ajax(
		{
	        type: 	'POST',
	        url : 	'ws/presupuestos/respondersolicitud',
	        data: 	{ periodor:periodo_receptor, aprobado:aprobado, idregistro:idregistro, detalle:json },
	        success : function( result )
        	{
				if( result.result )
				{
					if( result.records.estado == 1 )
					{
		            	$("#modal-confirmar	").modal('hide'); 
		            	$("#modal-detalle").modal('hide'); 
						toastr['success'](result.message, 'Éxito');
		            	setTimeout( function(){ amigable(); }, 500);
		            	$('#loader').fadeOut();
		            }

		            else if( result.records.estado == 3 )
		            {
		            	$("#modal-confirmar").modal('hide'); 
		            	$("#modal-detalle").modal('hide'); 
		            	toastr['warning'](result.message, 'Información');
		            	setTimeout( function(){ amigable(); }, 500);
		            	$('#loader').fadeOut();
		            }
          		}
		  		else
		  		{
					$("#modal-confirmar	").modal('hide'); 
		            $("#modal-detalle").modal('hide'); 
	            	$('#loader').fadeOut();
					toastr['error'](result.message, 'Error');
	          	}      
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});
	
	function numberWithCommas( x ) 
	{
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	$("#tabla-registros").on('click','.btn-aprobar', function(e){
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	});

	$('#btn-aprobarManual').on('click', aprobacionManual);

	function aprobacionManual ( e )
	{
		e.preventDefault();
		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/presupuestos/aprobacionmanual/'+idregistro,
			data: 		$('#form-aprobar').serialize(),
			success: function( result )
			{
				console.log($('#form-aprobar').serialize())
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-confirmarManual").modal('hide');
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
			}
		});
	}
});