jQuery( document ).ready( function( $ )
{
    window.tabla_registros = $("#tabla-registros").DataTable(
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

    var idregistro = 0;
    var ideliminar = 0;
    
    //------------- Llena la tabla de registros ---------------
    function llenarTabla()
    {        
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax(
        {
            url:        'ws/voluntariados/album/galeria',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        { 
            if( data.result )
            {
                cont = 0;
                $.each( data.records, function( index,value )
                {
                    if (value.estado == 0) {
                        visible='glyphicon glyphicon-ok';
                        color  ='btn-info';  
                        accion ='habilitar';
                        estado = value.estado == 0 ? '<span class="label label-info">Pendiente</span>' : '';
                        acciones =  '<td>'+
                                    '<a class="btn '+color+' btn-opcion" style="margin:3px;" href="#modal-imagen" data-toggle="modal" data-idregistro="'+value.id+'"><i class="'+visible+'"></i></a>'+
                                '</td>';

                        fotografia = '<td>'+
                                        '<img class="tamaño" src="'+value.url_foto+'">'+
                                     '</td>';
                        col1 = ++cont;
                        col2 = fotografia;
                        col3 = value.nombre;
                        col4 = value.uid_usuario;
                        col5 = value.album.nombre;
                        col6 = value.voluntariado_nombre;
                        col7 = estado;
                        col8 = acciones;
                        window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8]).draw(false);
                    }
                }); 
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log(err);
        })  
        .always( function()
        {
            $("#loader").fadeOut();
        });     
    }

    $('#tabla-registros').on('click', 'a.btn-opcion', function( e )
    {
        e.preventDefault();
        idregistro = $(this).data('idregistro');

        $.ajax(
        {
            url:        'ws/voluntariados/album/galeria/'+idregistro,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )   
            {
                document.getElementById("imagen").innerHTML = ['<img class="estilo" align="center" src="'+data.records.url_foto+'"/>'];
            }
            else {
                toastr['error'](data.message, 'Error');
            }
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });  
    });

    $('#btn-aprobar').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'PUT',
            url:        'ws/voluntariados/album/galeria/'+idregistro,
            dataType:   'json',
            data:       {estado: 1 }
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-imagen').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });
    });

    $('#btn-rechazar').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'PUT',
            url:        'ws/voluntariados/album/galeria/'+idregistro,
            dataType:   'json',
            data:       {estado: 2 }
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-imagen').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log( err );
        })  
        .always( function()
        {
            console.log('Completo');
        });
    });

});