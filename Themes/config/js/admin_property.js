﻿$(document).ready(function() {

    $('.selectlang').unbind("click");
    $(".selectlang").click(function() {
        $('.actionbuttonwrapper').hide();
        $('.editlanguage').hide();
        $('.processing').show();
        $("#nextlang").val($(this).attr("editlang"));
        if ($("#razortemplate").val() == 'Admin_PropertyDetail.cshtml') {
            //move data to update postback field
            nbxget('property_admin_save', '#propertydatasection', '#actionreturn');
        } else {
            // Need to save list
            nbxget('property_admin_getlist', '#nbs_propertyadminsearch', '#datadisplay');
        }
    });

    $(document).on("nbxgetcompleted", Admin_property_nbxgetCompleted); // assign a completed event for the ajax calls

        // start load all ajax data, continued by js in product.js file
        $('.processing').show();

        $('#razortemplate').val('Admin_PropertyList.cshtml');
        nbxget('property_admin_getlist', '#nbs_propertyadminsearch', '#datadisplay');


        var $container = $('#selectlistwrapper').masonry({
            columnWidth: 120, // List item width - Can also use CSS width of first list item
            itemSelector: '.productlistitem',
            gutter: 6, // Set horizontal gap and include in calculations. Also used in CSS for vertical gap
            isOriginLeft: true, // Build from right to left if false
            isOriginTop: true // Build from bottom to top if false
        });

        // initialize Masonry after all images have loaded - Webkit needs this when image containers don't have a fixed height
        $container.imagesLoaded(function () {
            $container.masonry();
        });


        // function to do actions after an ajax call has been made.
        function Admin_property_nbxgetCompleted(e) {

            $('.actionbuttonwrapper').show();
            $('.editlanguage').show();


            //NBS - Tooltips
            $('[data-toggle="tooltip"]').tooltip({
                animation: 'true',
                placement: 'auto top',
                viewport: { selector: '#content', padding: 0 },
                delay: { show: 100, hide: 200 }
            });

            $('#productAdmin_cmdAddNew').unbind("click");
            $('#productAdmin_cmdAddNew').click(function () {
                $('.processing').show();
                $('#razortemplate').val('Admin_ProductDetail.cshtml');
                nbxget('product_adminaddnew', '#nbs_productadminsearch', '#datadisplay');
            });

            if (e.cmd == 'category_categoryproductlist'
                || e.cmd == 'category_selectchangehidden'
                || e.cmd == 'category_copyallcatxref'
                || e.cmd == 'category_moveallcatxref'
                || e.cmd == 'category_cattaxupdate'
                || e.cmd == 'category_admin_savelist') {
                $('.processing').hide();
            };

            if (e.cmd == 'category_admin_getlist'
                || e.cmd == 'category_admin_delete'
                || e.cmd == 'category_admin_movecategory'
                || e.cmd == 'category_admin_addnew') {
            
                $('.processing').hide();

                $("#categoryAdmin_cmdAddNew").show();
                $("#categoryAdmin_cmdSaveList").show();

                $("#categoryAdmin_cmdSaveExit").hide();
                $("#categoryAdmin_cmdSave").hide();
                $("#categoryAdmin_cmdSaveAs").hide();
                $("#categoryAdmin_cmdDelete").hide();
                $("#categoryAdmin_cmdReturn").hide();

                // Move products
                $(".selectmove").hide();
                $(".selectcancel").hide();
                $(".selectrecord").show();
                $(".savebutton").hide();

                $('.selectrecord').unbind("click");
                $(".selectrecord").click(function() {
                    $(".selectrecord").hide();
                    $(".selectmove").show();
                    $(".selectmove[itemid='" + $(this).attr("itemid") + "']").hide();
                    $(".selectcancel[itemid='" + $(this).attr("itemid") + "']").show();
                    $("#movecatid").val($(this).attr("itemid"));

                    var selectid = $(this).attr("itemid");
                    $(".selectmove").each(function(index) {
                        if ($(this).attr("parentlist").indexOf(selectid + ";") > -1) $(this).hide();
                    });

                });

                $('.selectcancel').unbind("click");
                $(".selectcancel").click(function() {
                    $(".selectmove").hide();
                    $(".selectcancel").hide();
                    $(".selectrecord").show();
                });

                $('.selectmove').unbind("click");
                $(".selectmove").click(function() {
                    $(".selectmove").hide();
                    $(".selectcancel").hide();
                    $(".selectrecord").show();
                    $("#movetocatid").val($(this).attr("itemid"));
                    nbxget('category_admin_movecategory', '#nbs_categoryadminsearch', '#datadisplay');
                });

                // editbutton created by list, so needs to be assigned on each render of list.
                $('.categoryAdmin_cmdEdit').unbind("click");
                $('.categoryAdmin_cmdEdit').click(function () {
                    $('.processing').show();
                    $('#razortemplate').val('Admin_CategoryDetail.cshtml');
                    $('#selectedcatid').val($(this).attr('itemid'));
                    nbxget('category_admin_getdetail', '#nbs_categoryadminsearch', '#datadisplay');
                });


                $('.selectchangehidden').unbind("click");
                $('.selectchangehidden').click(function () {
                    $('.processing').show();
                    $('#selectedcatid').val($(this).attr('itemid'));
                    if ($(this).hasClass("fa-check-circle")) {
                        $(this).addClass('fa-circle').removeClass('fa-check-circle');
                    } else {
                        $(this).addClass('fa-check-circle').removeClass('fa-circle');
                    }
                    nbxget('category_selectchangehidden', '#nbs_categoryadminsearch');
                });

                $('.cmdopen').unbind("click");
                $(".cmdopen").click(function () {
                    $('.processing').show();
                    $('#returncatid').val($('#catid').val() + "," + $('#returncatid').val());
                    $('#catid').val($(this).attr('itemid'));
                    $('#razortemplate').val('Admin_CategoryList.cshtml');
                    nbxget('category_admin_getlist', '#nbs_categoryadminsearch', '#datadisplay');
                });

                $('.cmdreturn').unbind("click");
                $(".cmdreturn").click(function () {
                    $('.processing').show();
                    var array = $('#returncatid').val().split(',');
                    $('#catid').val(array[0]);
                    $('#returncatid').val($('#returncatid').val().replace(array[0] + ",",""));
                    $('#razortemplate').val('Admin_CategoryList.cshtml');
                    nbxget('category_admin_getlist', '#nbs_categoryadminsearch', '#datadisplay');
                });

                $('#categoryAdmin_cmdAddNew').unbind("click");
                $("#categoryAdmin_cmdAddNew").click(function () {
                    $('.processing').show();
                    nbxget('category_admin_addnew', '#nbs_categoryadminsearch', '#datadisplay');
                });

                $('.categoryAdmin_cmdDelete').unbind("click");
                $(".categoryAdmin_cmdDelete").click(function () {
                    if (confirm($('#confirmdeletemsg').text())) {
                        $('.processing').show();
                        $('#selectedcatid').val($(this).attr('itemid'));
                        nbxget('category_admin_delete', '#nbs_categoryadminsearch', '#datadisplay');
                    }
                });


                $('#categoryAdmin_cmdSaveList').unbind("click");
                $("#categoryAdmin_cmdSaveList").click(function () {
                    $('.processing').show();
                    nbxget('category_admin_savelist', '.categoryfields', '', '.categoryitemfields');
                });

                $('.categorynametextbox').unbind("change");
                $(".categorynametextbox").change(function () {
                    $('#isdirty_' + $(this).attr('lp')).val('True');
                });
            
            }

            if (e.cmd == 'product_admin_save') {
                $("#editlang").val($("#nextlang").val());
                $("#editlanguage").val($("#nextlang").val());
                nbxget('product_admin_getdetail', '#nbs_productadminsearch', '#datadisplay');
            };

            if (e.cmd == 'product_admin_saveexit' || e.cmd == 'product_admin_saveas') {
                $("#editlang").val($("#nextlang").val());
                $("#editlanguage").val($("#nextlang").val());
                $('#razortemplate').val('Admin_ProductList.cshtml');
                $('#selecteditemid').val('');
                nbxget('product_admin_getlist', '#nbs_productadminsearch', '#datadisplay');
            };

            if (e.cmd == 'category_displayproductselect') {
                setupbackoffice(); // run JS to deal with standard BO functions like accordian.   NOTE: Select2 can only be assigned 1 time.
            };

            if (e.cmd == 'category_admin_getdetail'
                || e.cmd == 'category_removeimage'
                || e.cmd == 'category_updateimages') {            

                setupbackoffice(); // run JS to deal with standard BO functions like accordian.   NOTE: Select2 can only be assigned 1 time.

                $('.actionbuttonwrapper').show();        

                $("#categoryAdmin_cmdAddNew").hide();
                $("#categoryAdmin_cmdSaveList").hide();

                $("#categoryAdmin_cmdSaveExit").show();
                $("#categoryAdmin_cmdSave").show();
                $("#categoryAdmin_cmdDelete").show();
                $("#categoryAdmin_cmdReturn").show();

                $('#datadisplay').children().find('.sortelementUp').click(function () { moveUp($(this).parent()); });
                $('#datadisplay').children().find('.sortelementDown').click(function () { moveDown($(this).parent()); });


                // ---------------------------------------------------------------------------
                // FILE UPLOAD
                // ---------------------------------------------------------------------------
                var filecount = 0;
                var filesdone = 0;
                $(function () {
                    'use strict';
                    var url = '/DesktopModules/NBright/NBrightBuy/XmlConnector.ashx?cmd=fileupload';
                    $('#fileupload').unbind('fileupload');
                    $('#fileupload').fileupload({
                        url: url,
                        maxFileSize: 5000000,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                        dataType: 'json'
                    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
                        .bind('fileuploadprogressall', function (e, data) {
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            $('#progress .progress-bar').css('width', progress + '%');
                        })
                        .bind('fileuploadadd', function (e, data) {
                            $.each(data.files, function (index, file) {
                                $('input[id*="imguploadlist"]').val($('input[id*="imguploadlist"]').val() + file.name + ',');
                                filesdone = filesdone + 1;
                            });
                        })
                        .bind('fileuploadchange', function (e, data) {
                            filecount = data.files.length;
                            $('.processing').show();
                        })
                        .bind('fileuploaddrop', function (e, data) {
                            filecount = data.files.length;
                            $('.processing').show();
                        })
                        .bind('fileuploadstop', function (e) {
                            if (filesdone == filecount) {
                                nbxget('category_updateimages', '#nbs_categoryadminsearch', '#datadisplay'); // load images
                                filesdone = 0;
                                $('input[id*="imguploadlist"]').val('');
                                $('.processing').hide();
                                $('#progress .progress-bar').css('width', '0');
                            }
                        });
                });

                $('#removeimage').unbind("click");
                $('#removeimage').click(function () {
                    $('.processing').show();
                    nbxget('category_removeimage', '#nbs_categoryadminsearch', '#datadisplay');
                });
            

                // ---------------------------------------------------------------------------
                // ACTION BUTTONS
                // ---------------------------------------------------------------------------
                $('#categoryAdmin_cmdReturn').unbind("click");
                $('#categoryAdmin_cmdReturn').click(function () {
                    $('.processing').show();
                    $('#selectedcatid').val('');
                    $('#razortemplate').val('Admin_CategoryList.cshtml');
                    nbxget('category_admin_getlist', '#nbs_categoryadminsearch', '#datadisplay');
                });
            
                $('#categoryAdmin_cmdSave').unbind("click");
                $('#categoryAdmin_cmdSave').click(function () {
                    $('.processing').show();
                    nbxget('category_admin_save', '#categorydatasection');
                });

                $('#categoryAdmin_cmdSaveExit').unbind("click");
                $('#categoryAdmin_cmdSaveExit').click(function () {
                    $('.processing').show();
                    nbxget('category_admin_saveexit', '#categorydatasection');
                });


                $('#categoryAdmin_cmdDelete').unbind("click");
                $('#categoryAdmin_cmdDelete').click(function () {
                    if (confirm($('#confirmdeletemsg').text())) {
                        $('.processing').show();
                        $('#selectedcatid').val($(this).attr('itemid'));
                        nbxget('category_admin_delete', '#nbs_categoryadminsearch', '#datadisplay');                    
                    }
                });



                // ---------------------------------------------------------------------------
                // Product Select
                // ---------------------------------------------------------------------------
                $('#productselect').unbind();
                $('#productselect').click(function () {
                    $('.processing').show();
                    $('#razortemplate').val('Admin_ProductSelectList.cshtml');
                    nbxget('category_displayproductselect', '#nbs_categoryadminsearch', '#datadisplay');
                });


                // remove single product
                $('.removeproduct').unbind();
                $('.removeproduct').click(function () {
                    $('#selectproductid').val($(this).attr('itemid'));
                    $('.productid' + $(this).attr('itemid')).hide();
                    nbxget('category_deletecatxref', '#nbs_categoryadminsearch');
                });

                $('#removeall').unbind();
                $('#removeall').click(function () {
                    if (confirm($('#confirmmsg').html())) {
                        $('#productlist').hide();
                        nbxget('category_deleteallcatxref', '#nbs_categoryadminsearch');
                    }
                });

                $('select[id*="selectcatid"]').change(function () {
                    $('input[id*="newcatid"]').val($(this).val());
                });

                $('#copyto').unbind();
                $('#copyto').click(function () {
                    if (confirm($('#confirmmsg').html())) {
                        $('.processing').show();
                        $('#selectproductid').val($(this).attr('itemid'));
                        nbxget('category_copyallcatxref', '#nbs_categoryadminsearch', '#nbsnotify');
                    }
                });

                $('#moveto').unbind();
                $('#moveto').click(function () {
                    if (confirm($('#confirmmsg').html())) {
                        $('.processing').show();
                        $('#productlist').hide();
                        nbxget('category_moveallcatxref', '#nbs_categoryadminsearch', '#nbsnotify');
                    }
                });


                $('#producttax').unbind();
                $('#producttax').click(function () {
                    $('#selecttaxrate').val($('select[id*=taxrate]').val());
                    $('.processing').show();
                    nbxget('category_cattaxupdate', '#nbs_categoryadminsearch', '#nbsnotify');
                });



                $('.processing').hide();

            }

            if (e.cmd == 'category_admin_save') {
                $('.processing').show();
                $('#razortemplate').val('Admin_CategoryDetail.cshtml');
                nbxget('category_admin_getdetail', '#nbs_categoryadminsearch', '#datadisplay');
            }
            if (e.cmd == 'category_admin_saveexit') {
                $('.processing').show();
                $('#razortemplate').val('Admin_CategoryList.cshtml');
                nbxget('category_admin_getlist', '#nbs_categoryadminsearch', '#datadisplay');
            }

            // ---------------------------------------------------------------------------
            // Product Select
            // ---------------------------------------------------------------------------
            if (e.cmd == 'category_getproductselectlist') {
                $('.processing').hide();

                $("#categoryAdmin_cmdSaveExit").hide();
                $("#categoryAdmin_cmdSave").hide();
                $("#categoryAdmin_cmdDelete").hide();
                $("#categoryAdmin_cmdReturn").hide();

                $('#returnfromselect').click(function () {
                    $("#searchtext").val('');
                    $("#searchcategory").val('');
                    $('#razortemplate').val('Admin_CategoryDetail.cshtml');
                    nbxget('category_admin_getdetail', '#nbs_categoryadminsearch', '#datadisplay');
                    $('#datadisplay').show();
                });

                $('#selectsearch').unbind("click");
                $('#selectsearch').click(function () {
                    $('.processing').show();
                    $('#pagenumber').val('1');
                    $('#searchtext').val($('#txtproductselectsearch').val());
                    $('#searchcategory').val($('#ddlsearchcategory').val());
                    nbxget('category_getproductselectlist', '#nbs_categoryadminsearch', '#productselectlist');
                });

                $('#selectreset').unbind("click");
                $('#selectreset').click(function () {
                    $('.processing').show();
                    $('#pagenumber').val('1');
                    $('#searchtext').val('');
                    $("#searchcategory").val('');
                    $('#txtproductselectsearch').val('');
                    nbxget('category_getproductselectlist', '#nbs_categoryadminsearch', '#productselectlist');
                });

                $('.cmdPg').unbind("click");
                $('.cmdPg').click(function () {
                    $('.processing').show();
                    $('#pagenumber').val($(this).attr('pagenumber'));
                    nbxget('category_getproductselectlist', '#nbs_categoryadminsearch', '#productselectlist');
                });

                // select product
                $('.selectproduct').unbind();
                $('.selectproduct').click(function () {
                    $('.selectproductid' + $(this).attr('itemid')).hide();
                    $('#selectproductid').val($(this).attr('itemid'));
                    nbxget('category_selectcatxref', '#nbs_categoryadminsearch'); 
                });

            };

        };

        // ---------------------------------------------------------------------------
        // FUNCTIONS
        // ---------------------------------------------------------------------------
        function moveUp(item) {
            var prev = item.prev();
            if (prev.length == 0)
                return;
            prev.css('z-index', 999).css('position', 'relative').animate({ top: item.height() }, 250);
            item.css('z-index', 1000).css('position', 'relative').animate({ top: '-' + prev.height() }, 300, function () {
                prev.css('z-index', '').css('top', '').css('position', '');
                item.css('z-index', '').css('top', '').css('position', '');
                item.insertBefore(prev);
            });
        }
        function moveDown(item) {
            var next = item.next();
            if (next.length == 0)
                return;
            next.css('z-index', 999).css('position', 'relative').animate({ top: '-' + item.height() }, 250);
            item.css('z-index', 1000).css('position', 'relative').animate({ top: next.height() }, 300, function () {
                next.css('z-index', '').css('top', '').css('position', '');
                item.css('z-index', '').css('top', '').css('position', '');
                item.insertAfter(next);
            });
        }

        // ---------------------------------------------------------------------------

    });
