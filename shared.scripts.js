/* Shared.Functions ver 2.0.1 - MIT licensed */
/*
 * @summary     jS/jQ Shared Functions for html dom manipulation/validation
 * @version     2.0.1
 * @file        shared.functions.js
* @required    jQ, datatables, tabletools, notifyit, 
 * @author      Ivan Ramos
 */
/*   This functions come without warranty, for any comments or support please */

// Check to see if jQuery is loaded. If not, load it from the public jQuery CDN.
if (typeof jQuery == 'undefined') {
    // Load the latest jQuery library from jQuery
    document.write('\x3Cscript type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js">\x3C/script>');
}

// Requires: Notify.js and Notify.css on report
// Returns a notify message in screen depending of the current IE version
// also checks for status of compatibility mode
function DetectIEVersion() {

    // Get the user agent string
    var ua = navigator.userAgent;
    var compatibilityMode, version;

    // Detect whether or not the browser is IE
    var ieRegex = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

    if (ieRegex.exec(ua) != null) {
        // Get the current "emulated" version of IE
        var renderVersion = parseFloat(RegExp.$1);
        version = renderVersion;

        // Check the browser version with the rest of the agent string to detect compatibility mode
        if (ua.indexOf("Trident/6.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                compatibilityMode = true;
                version = 10; // IE 10
            }
        } else if (ua.indexOf("Trident/5.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                compatibilityMode = true;
                version = 9; // IE 9
            }
        } else if (ua.indexOf("Trident/4.0") > -1) {
            if (ua.indexOf("MSIE 7.0") > -1) {
                compatibilityMode = true;
                version = 8; // IE 8
            }
        } else if (ua.indexOf("MSIE 7.0") > -1)
            version = 7; // IE 7
        else
            version = 6; // IE 6


        var iMessage;
        if (compatibilityMode == true) {
            iMessage = 'IE' + version + ' version detected in compatibility mode.     Some features may not work properly. Please consider using another browser to avoid any misfunction.';

        } else {
            if (version < 9) {
                iMessage = 'Outdated (IE' + version + ') version detected.                   Some features currently won\'t be available until you upgrade it or switch to another browser.';
            } else {
                iMessage = 'IE' + version + ' version detected. Some features may not work properly. Please consider switching to another browser.';
            }
        }

        return $().shownotify('showNotify', {
            text: iMessage,
            sticky: false,
            position: 'top-right',
            type: 'warning',
            closeText: ''
        });

    } else
        return jQuery.noop();
}

// Checks if we have datauri support in current browser
// if we have support for datauri support then we can stream generated PDF right into the browser
// otherwise we should use Downloadify script to allow user to save PDF file
function CheckDataURISupport() {
    var result = true;
    var checkDataURISupportImage = new Image();

    checkDataURISupportImage.onload = checkDataURISupportImage.onerror = function() {
        if (this.width != 1 || this.height != 1) {
            result = false;
        }
    }
    checkDataURISupportImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    // check if we have datauri support in current browser - end
    return result;
}

/*---------------------- Datatable initialization  --------------------------- */
/*
 * @$table           Table id which be initialized
 * @sortCol          Column number that will be initially sortered 
 * @sorOrder         Ascendant (asc) or Descendant (desc)
 * @enFilter         Boolean value to enable or not the filter option
 * @enPaginate       Boolean value to enable or not the filter option
 * @dplyLength       Number of records contained per page when pagination is enabled
 * @enInfo           Boolean value to show or not the records info
 * @autoWidth        Boolean value to enable or not table autowidth
 * @enTblTools       Boolean value to enable or not the table tools addin
 * @pdfOrientation   Page orientation (landscape, portrait) for pdf documents (required enTblTools == enabled)
 * @fileName         Output file naming (required enTblTools == enabled)
 /*------------------------------------------------------------------------------*/
function initDataTable($table, sortCol, sortOrder, enFilter, enPaginate, dplyLength, enInfo, autoWidth, enTblTools, pdfOrientation, fileName) {
    $table.find("tbody tr td").each(function() {
        $(this).removeClass()
    }); /* Clear current coloring class */
    var dom = (enTblTools) ? 'T<"top"ip><"clear">' : '<"top"ip><"clear">';

    var oTable = $table.dataTable({
        "order": [
            [sortCol, sortOrder]
        ],
        "bDestroy": true,
        "bProcessing": true,
        "dom": dom,
        "bFilter": enFilter,
        "bSort": true,
        "bSortClasses": true,
        "bPaginate": enPaginate,
        "sPaginationType": "full_numbers",
        "iDisplayLength": dplyLength,
        "bInfo": enInfo,
        "bAutoWidth": autoWidth,
        "tableTools": {
            "aButtons": [{
                    "sExtends": "copy",
                    "sButtonText": "Copy",
                    "bHeader": true,
                    "bFooter": true,
                    "fnComplete": function(nButton, oConfig, oFlash, sFlash) {
                        $().shownotify('showNotify', {
                            text: 'Table copied to clipboard (no formatting)',
                            sticky: false,
                            position: 'middle-center',
                            type: 'success',
                            closeText: ''
                        });
                    }
                }, {
                    "sExtends": "csv",
                    "sButtonText": "Excel (CSV)",
                    "sToolTip": "Save as CSV file (no formatting)",
                    "bHeader": true,
                    "bFooter": true,
                    "sTitle": fileName,
                    "sFileName": fileName + ".csv",
                    "fnComplete": function(nButton, oConfig, oFlash, sFlash) {
                        $().shownotify('showNotify', {
                            text: 'CSV file saved in selected location.',
                            sticky: false,
                            position: 'middle-center',
                            type: 'success',
                            closeText: ''
                        });
                    }
                }, {
                    "sExtends": "pdf",
                    "sPdfOrientation": pdfOrientation,
                    "bFooter": true,
                    "sTitle": fileName,
                    "sFileName": fileName + ".pdf",
                    "fnComplete": function(nButton, oConfig, oFlash, sFlash) {
                        $().shownotify('showNotify', {
                            text: 'PDF file saved in selected location.',
                            sticky: false,
                            position: 'middle-center',
                            type: 'success',
                            closeText: ''
                        });
                    }
                },
                /*{
                                                                      "sExtends": "Other",
                                                                      "bShowAll": true,
                                                                      "sMessage": fileName,
                                                                      "sInfo": "Please press escape when done"
                                                                      }*/
            ]
        }
        /*"fnDrawCallback": function( oSettings ) {alert( 'DataTables has redrawn the table' );}*/
    });
    /* If is IE then avoid setting the sticky headers */
    if (!navigator.userAgent.match(/msie/i) && enPaginate == false) {
        new $.fn.dataTable.FixedHeader(oTable);
    }

    return oTable
}
