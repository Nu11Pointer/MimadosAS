// Variables Globales
var rowSelected;
var productTable;
var productObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuProducts').addClass('active');
    $('#collapseFive').addClass('show');
    $('#CollapseMenuItemProduct').addClass('active');

    // Show DataTable
    Read();

    // Cargar Selectores
    LoadSelectors();

    // Crear Validaciones
    Validator();
    
    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function Read() {
    productTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Product/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            { "data": "ProductBrand.Name" },
            { "data": "ProductCategory.Name" },
            { "data": "SalePrice", "render": value => "C$" + value.toFixed(2)},
            { "data": "Stock" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "columnDefs": [
        { "width": "20%", "targets": 1 }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function LoadSelectors() {

    // Marcas
    jQuery.ajax({
        url: '/ProductBrand/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductBrandCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductBrandUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Categorias
    jQuery.ajax({
        url: '/ProductCategory/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductCategoryCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductCategoryUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#SalePriceCreate").val(0);
    $("#StockCreate").val(0);
    $("#ProductCategoryCreate").val($("#ProductCategoryCreate option:first").val());
    $("#ProductBrandCreate").val($("#ProductBrandCreate option:first").val());
    $("#ActiveCreate").val($("#ActiveCreate option:first").val());
    $("#DescriptionCreate").val("");
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function Validator() {

    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            },
            SalePriceCreate: {
                required: true,
                number: true
            },
            StockCreate: {
                required: true,
                number: true
            }
        },
        messages: {
            NameCreate: {
                required: "- El campo \"Nombre\" es obligatorio."
            },
            SalePriceCreate: {
                required: "- El campo \"Precio Venta\" es obligatorio.",
                number: "- El campo \"Precio Venta\" debe ser numerico."
            },
            StockCreate: {
                required: "- El campo \"Stock\" es obligatorio.",
                number: "- El campo \"Stock\" debe ser numerico."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            },
            SalePriceUpdate: {
                required: true,
                number: true
            },
            StockUpdate: {
                required: true,
                number: true
            }
        },
        messages: {
            NameUpdate: {
                required: "- El campo \"Nombre\" es obligatorio."
            },
            SalePriceUpdate: {
                required: "- El campo \"Precio Venta\" es obligatorio.",
                number: "- El campo \"Precio Venta\" debe ser numerico."
            },
            StockUpdate: {
                required: "- El campo \"Stock\" es obligatorio.",
                number: "- El campo \"Stock\" debe ser numerico."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    productObj = {
        "Id": 0,
        "ProductBrand": {
            "Id": $("#ProductBrandCreate option:selected").val()
        },
        "ProductCategory": {
            "Id": $("#ProductCategoryCreate option:selected").val()
        },
        "Name": $("#NameCreate").val(),
        "Description": $("#DescriptionCreate").val(),
        "SalePrice": $("#SalePriceCreate").val(),
        "Stock": $("#StockCreate").val(),
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Product/Create',
        type: "POST",
        data: JSON.stringify({ product: productObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            productTable.ajax.reload();
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");
            if (response.result) {
                productTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Producto.", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    productObj = productTable.row(rowSelected).data();

    $("#NameUpdate").val(productObj.Name);
    $("#SalePriceUpdate").val(productObj.SalePrice);
    $("#StockUpdate").val(productObj.Stock);
    $("#ProductCategoryUpdate").val(productObj.ProductCategory.Id);
    $("#ProductBrandUpdate").val(productObj.ProductBrand.Id);
    $("#ActiveUpdate").val(productObj.Active ? 1 : 0);
    $("#DescriptionUpdate").val(productObj.Description);
    $("#FormModalUpdate").modal("show"); 
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    productObj = {
        "Id": productObj.Id,
        "ProductBrand": {
            "Id": $("#ProductBrandUpdate option:selected").val()
        },
        "ProductCategory": {
            "Id": $("#ProductCategoryUpdate option:selected").val()
        },
        "Name": $("#NameUpdate").val(),
        "Description": $("#DescriptionUpdate").val(),
        "SalePrice": $("#SalePriceUpdate").val(),
        "Stock": $("#StockUpdate").val(),
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Product/Update',
        type: "POST",
        data: JSON.stringify({ product: productObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            if (response.result) {
                productTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el Producto.", response.message, "error");
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    productObj = productTable.row(rowSelected).data();

    swal({
        title: "Eliminar Producto",
        text: "¿Estas Seguro que Deseas Eliminar Esta Producto?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Product/Delete',
                type: "POST",
                data: JSON.stringify({ product: productObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        productTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el Producto.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        }
    );
}
