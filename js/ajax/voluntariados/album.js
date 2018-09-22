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
    var id = 0;
    var ideliminar = 0;

    $('.chosen-select').chosen({'width':'100%','height':'50%','white-space':'nowrap'});

    //------------- Limpiar Formulario de crear  ---------------
    function limpiar (){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();

        $('#nombre')      .removeClass('valid');
        $('#edit_nombre') .removeClass('valid');
        $('#foto')        .removeClass('valid');

        $('#nombre')      .removeClass('error');
        $('#foto')        .removeClass('error');

        $('#edit_nombre') .removeClass('error');
        $('#edit_foto')   .removeClass('error');
        $('#voluntariado').trigger('chosen:updated');
         
    }
    $('#crearRegistro').on('click',function(){
       limpiar();
    });
    
    //------------- Llena la tabla de registros ---------------
    function llenarTabla()
    {        
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax(
        {
            url:        'ws/voluntariados/fotos/album',
            type:       'GET',
            dataType:   'json',
            data:       {uid_usuario:$('#email-user').text()}
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
                        estado = value.estado == 0 ? '<span class="label label-danger">Deshabilitado</span>' : '';
                    }else{
                        visible='glyphicon glyphicon-remove';
                        color  ='btn-danger';
                        accion ='deshabilitar';
                        estado = value.estado == 1 ? '<span class="label label-success">Habilitado</span>' : '';
                    }   
                    if (value.galeria.length > 0) {
                        acciones =  '<td>'+
                                    '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Editar"><i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn '+color+' btn-xs btn-editar" style="margin:3px;" href="#modal-'+accion+'" data-toggle="modal" data-idregistro="'+value.id+'" title="'+accion+'"><i class="'+visible+'"></i></a>'+
                                    '<a class="btn btn-success btn-xs btn-detalle" href="#modal-detalle" data-toggle="modal"  data-idregistro="'+value.id+'" title="Detalle"><i class="fa fa-list"></i></a>'+
                                '</td>';
                    } else {
                        acciones =  '<td>'+
                                    '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Editar"><i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn '+color+' btn-xs btn-editar" style="margin:3px;" href="#modal-'+accion+'" data-toggle="modal" data-idregistro="'+value.id+'" title="'+accion+'"><i class="'+visible+'"></i></a>'+
                                '</td>';
                    } 
                    
                    portada = '<td>'+
                                    '<img class="tamaño_portada" src="'+value.foto_portada+'">'+
                                 '</td>';

                    col1 = ++cont;
                    col2 = portada;
                    col3 = value.nombre;
                    col4 = value.voluntariado ? value.voluntariado.descripcion : '';
                    col5 = value.fecha_voluntariado;
                    col6 = estado;
                    col7 = acciones;
                    window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7]).draw(false);
                });
                $('.btn-detalle').on('click',function(){
                    $('#detalle').show();
                    $('#detalle-eliminar').hide();
                    $('#imagen').html('');
                    idregistro = $(this).data('idregistro');
                    $.ajax(
                        {
                            url:        'ws/voluntariados/lista/album',
                            type:       'GET',
                            dataType:   'json',
                            data:       {uid_usuario:$('#email-user').text()}
                        })
                        .done(function(data)
                        { 
                             $.each( data.records, function( index,value ){
                                if (value.id == idregistro) {
                                    if (value.galeria.length>0) {
                                        $.each(value.galeria, function (index,value){
                                            $("#imagen").append(
                                                '<div class="col-sm-6">'+
                                                '<img class="estilo" width="auto" height="300" align="center" src="'+value.url_foto+'"/>'+
                                                '<br>'+'<br>'+
                                                '<button class="btn btn-danger btn-eliminar-imagen"  data-idregistro="'+value.id+'">Eliminar</button>'+
                                                '<br>'+'<br>'+
                                                '</div>'
                                                );
                                        });
                                    } 
                                } 
                             });
                             $('.btn-eliminar-imagen').on('click', function(){
                                idregistro_eliminar = $(this).data('idregistro');
                                $('#detalle').hide();
                                $('#detalle-eliminar').show();
                             });           
                             $('.btn-eliminar-cancelar').on('click', function(){
                                $('#detalle').show();
                                $('#detalle-eliminar').hide();
                             });                  
                             $('.btn-eliminar-confirmar').on('click',function(){
                                 $.ajax(
                                {
                                    url:        'ws/voluntariados/album/eliminar/foto',
                                    type:       'POST',
                                    dataType:   'json',
                                    data:       {id:idregistro_eliminar}
                                })
                                .done(function(data)
                                { 
                                    $('#modal-detalle').modal('hide'); 
                                    toastr['success'](data.message, 'Éxito');
                                    // llenarTabla();
                                })
                                .fail(function(err)
                                {
                                    toastr['error'](data.message, 'Error');
                                })  
                                .always( function()
                                {
                                    $("#loader").fadeOut();
                                }); 
                             });
                        }).fail(function(err)
                        {
                            console.log(err);
                        })  
                        .always( function()
                        {
                            $("#loader").fadeOut();
                        }); 

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

    //------------- Crear registro ---------------
    $('#btn-crear').on('click', function( e )
    {
        var datos = new FormData( $('#form-crear')[0] );

        if ($('#form-crear').valid()) {
            e.preventDefault();
            $.ajax(
            {
                type:       'POST',
                url:        'ws/voluntariados/fotos/album',
                dataType:   'json',
                data:       datos,
                async: false,
                cache: false,
                contentType: false,
                processData: false
            })
            .done(function(data)
            {
                if( data.result )   
                {
                    $('#modal-crear').modal('hide'); 
                    limpiar();
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
        }
    });

    //------------- Cargar la información del registro seleccionado ---------------
    $('#tabla-registros').on('click', 'a.btn-editar', function( e )
    {
        e.preventDefault();
        idregistro = $(this).data('idregistro');

        $.ajax(
        {
            url:        'ws/voluntariados/fotos/album/'+idregistro,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#edit_nombre').val( data.records.nombre );
                $("#form-editar #new_voluntariado_id").val(data.records.voluntariado_id);
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

    //------------- Editar registro ---------------
    $('#btn-actualizar').on('click', function( e )
    {
        $('#prueba').val(idregistro);
        var datos = new FormData( $('#form-editar')[0] );

        if ($('#form-editar').valid()) {
            e.preventDefault();
            $.ajax(
            {
                type:       'POST',
                url:        'ws/voluntariados/editar/album',
                dataType:   'json',
                data:        datos,
                async: false,
                cache: false,
                contentType: false,
                processData: false
            })
            .done(function(data)
            {
                if( data.result )   
                {
                    $('#modal-editar').modal('hide'); 
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
        }
          
    });


    $('#btn-habilitar').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'PUT',
            url:        'ws/voluntariados/fotos/album/'+idregistro,
            dataType:   'json',
            data:       {estado: 1 }
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-habilitar').modal('hide'); 
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

    $('#btn-deshabilitar').on('click', function( e )
    {    
        e.preventDefault();
        $.ajax(
        {
            type:       'PUT',
            url:        'ws/voluntariados/fotos/album/'+idregistro,
            dataType:   'json',
            data:       {estado: 0 }
        })
        .done(function(data)
        {
            if( data.result )   
            {
                $('#modal-deshabilitar').modal('hide'); 
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

    //------------- Cargar la información del registro seleccionado ---------------
    $('#tabla-registros').on('click', 'a.btn-eliminar', function( e )
    {
        e.preventDefault();
        ideliminar = $(this).data('idregistro');

    });

    //------------- Eliminar registro ---------------
    $('#btn-eliminar').on('click', function( e )
    {
        e.preventDefault();
        $.ajax(
        {
            type:       'DELETE',
            url:        'ws/voluntariados/fotos/album/'+ideliminar,
            dataType:   'json',

        })
        .done(function(data)
        {
            console.log( data );
            if( data.result )   
            {
                $('#modal-eliminar').modal('hide'); 
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

    $("#form-crear").validate({
        rules:{
            voluntariado:{
                required: true,
            }
        },
        messages:{
            voluntariado:{
                required: 'Este campo es obligatorio'
            }
        }
    });
});