jQuery( document ).ready( function( $ )
{
    var table = $('#tabla-registros').DataTable({
        language: {
            url: "lang/esp.lang"
        },
        processing: true,
        serverSide: true,
        ajax: 'ws/parametros/informacion/usuarios',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index', searchable: false},
            {data: 'usuario', name: 'usuario'},
            {data: 'nombre', name: 'nombre'},
            {data: 'sociedad', name: 'sociedad'},
            {data: 'ceco', name: 'ceco'},
            {data: 'uen', name: 'uen'},
            {data: 'empid', name: 'empid'},
            {data: 'pais', name: 'pais'},
            {data: 'pendientes', name: 'pendientes'},
            {data: 'android', name: 'android'},
            {data: 'versiones_android', name: 'versiones_android'},
            {data: 'version_android', name: 'version_android'},
            {data: 'dispositivo_android', name: 'dispositivo_android'},
            {data: 'ios', name: 'ios'},
            {data: 'versiones_ios', name: 'versiones_ios'},
            {data: 'version_ios', name: 'version_ios'},
            {data: 'version_iphone', name: 'version_iphone'},
            {data: 'ultimo_login', name: 'ultimo_login'},
            {data: 'tiempo_transcurrido', name: 'tiempo_transcurrido', searchable: false},
            {data: 'acciones', name: 'acciones', orderable: false, searchable: false}
        ],
        order: [[1, 'asc']]
    });

    var idregistro = 0;
    //llenarDatos();

    // function llenarDatos()
    // {
    //     $("#loader").show();
    //     $.ajax(
    //     {
    //         type:   'GET',
    //         url:    'ws/parametros/informacion/usuarios',
    //     })
    //     .done(function( data )
    //     {
    //         if( data.result )
    //         {
    //             contador = 0;
    //             $.each(data.records, function (index, valor) 
    //             { 
    //                 col0 = ++contador;
    //                 Col1=valor.usuario;
    //                 Col2=valor.nombre!='0'?valor.nombre:"" ;
    //                 Col3=valor.sociedad;
    //                 Col4=valor.ceco;
    //                 Col5=valor.uen;
    //                 Col6=valor.empid;
    //                 Col7=valor.pais;
    //                 Col8=valor.pendientes;
    //                 Col9=valor.android;
    //                 Col10="<label class='label label-success'>"+valor.versiones_android+"</label>";
    //                 Col11="<label class='label label-success'>"+valor.version_android+"</label>";
    //                 Col12="<label class='label label-success'>"+valor.dispositivo_android+"</label>";
    //                 Col13=valor.ios;
    //                 Col14="<label class='label label-success'>"+valor.versiones_ios+"</label>";
    //                 Col15="<label class='label label-success'>"+valor.version_ios+"</label>";
    //                 Col16="<label class='label label-success'>"+valor.version_iphone+"</label>";
    //                 Col17=valor.ultimo_login;
    //                 moment.locale('es');
    //                 var ahora=moment(valor.ultimo_login, "YYYY-MM-DD hh:mm:ss a").fromNow();
    //                 Col18=ahora;
    //                 Col19='<center><a class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+valor.usuario+'"><i class="fa fa-trash-o"></i></a></center>';
    //                 window.tabla_registros.row.add([col0,Col1,Col2,Col3,Col4,Col5,Col6,Col7,Col8,Col9,Col10,Col11,Col12,Col13,Col14,Col15,Col16,Col17,Col18,Col19]).draw();
    //             });
    //         }
    //         else
    //             toastr['error'](data.message, 'Error');
    //     })
    //     .fail(function( err )
    //     {
    //         toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
    //         console.log(err);
    //     })
    //     .always(function()
    //     {
    //         $('#loader').fadeOut();
    //     });
    // }

    table.on('click','a.btn-eliminar', function( e )
    {
        e.preventDefault();
        idregistro = $(e.target).closest("a").data("idregistro");
    });

    $('#btn-eliminar').on('click', function(e)
    {
        e.preventDefault();
        $.ajax(
        {
            type: "GET",
            url : "ws/eliminardispositivos?user="+idregistro,
            success : function( result )
            {
                if( result.result )
                {
                    toastr['success'](result.message, 'Éxito');
                    $("#modal-eliminar").modal('hide'); 
                    setTimeout( function(){ amigable(); }, 500);  
                }
                else
                {
                    toastr['error'](result.message, 'Error');
                    $("#modal-eliminar").modal('hide'); 
                }   
            },
            error: function( data )
            {
                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
            }
        });
    });
    $('#loader').fadeOut();
});