/*!
 * jQuery pluging for creating a timeline with events
 * Original author: @flightcubs
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // Defaults
    var pluginName = "timelined",
        defaults = {
            cWidth  : 200,
            cHeight : 500
        };

    // Plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var records, source = $(this.element);
            
            // Getting all records, setting the source element text to an empty string, and writing the timeline
            records = this.getEachRecord(source);
            source.text('');
            this.writeTimeline(source, records);
            
            // Expanding records on click to show date and description
            $( ".timeline-record " ).click(function() {
                $(this).children(".timeline-desc").toggleClass("timeline-hidden");
                $(this).find(".timeline-date").toggleClass("timeline-hidden");
                $(this).find(".timeline-triangle").toggleClass("timeline-down").toggleClass("timeline-up");
                $(this).toggleClass("timeline-to-top");
            });

        },

        /**
         * Extracts all timeline events
         * @param {jQuery object} source jQuery reference to the source html element
         */
        getEachRecord: function(source) {
            var textArr, 
                records = new Records(), 
                titleNext;

            // Extracting all text lines to an array, separated by new line
            textArr = source.text().split(/\n/);
            
            // Trimming whitespace from each string in the array (in case it is written with indentation)
            textArr = textArr.map(function(entry){ return entry.trim(); });  
            
            // Removing blank entries in array (i.e. originating from empty lines in the text)
            textArr = textArr.filter(function(n){ return n !== ""; }); // (JS 1.6 and above)
            
            // Here we are looping through all the text lines in the array textArr
            // The result is an object called 'records' which holds each separate records
            // Each new line that is a date will create a new record
            // The next entry after a date is the title (keeping track with the variable 'titleNext')
            // And all upcoming entries after the title makes up the description (until a new date appears)

            for (i = 0; i < textArr.length; ++i){
                // If Date, create new Record. Date must be exactly 10 characters because different browsers implement Date.parse() differently and will parse some non-dates
                if (textArr[i].length === 10 && !isNaN(Date.parse(textArr[i]))){     
                    records.addRecord(new Record(textArr[i]));
                    titleNext = true;
                } else if ( records.records.length < 0 ){   // If no Record has been created yet, do nothing
                    console.log('First line is not a date, please review the timeline entries');
                } else if ( titleNext === true ) {          // If the last loop was a new Record, then this is the title of the record
                    records.setTitleLast(textArr[i]);
                    titleNext = false;
                } else {                                    // Otherwise, concatenate the rest of the strings to the description of the record
                    records.addDescLast(textArr[i]);
                }            
            }
            
            // Sorting records by date
            records.sortByDate();
            
            return records;
        },
        
        /**
         * Draws the timeline
         * @param {jQuery object} source jQuery reference to the source html element
         * @param {object} records A Records object containing an array .records 
         */
        writeTimeline: function(source, records) {
      
            // Creating a wrapper for the timeline
            $( "<div id='timeline-wrapper'></div>" ).css({
                'position' : 'relative',
                'height': Number(this.options.cHeight) + 100
            }).appendTo(source);
            
            // Creating an overlay div for positioning regular html elements
            $( "<div id='timeline-overlay'></div>" ).css({
                'width' : this.options.cWidth,
                'height' : this.options.cHeight
                }).appendTo($( "#timeline-wrapper" ));

            // Creating a canvas
            $( "<canvas id='timeline-canvas' width='" + this.options.cWidth + "' height='" + this.options.cHeight + "'></canvas>" ).appendTo($( "#timeline-wrapper" ));
            canvas = document.getElementById('timeline-canvas');
            ct = canvas.getContext('2d');
            
            // Canvas fix - Rendering text on high-DPI screens
            // Credit @joubertnel https://gist.github.com/joubertnel/870190
            var hidefCanvas = canvas;
            var hidefContext = ct;
            
            if (window.devicePixelRatio) {
                var hidefCanvasWidth = $(hidefCanvas).attr('width');
                var hidefCanvasHeight = $(hidefCanvas).attr('height');
                var hidefCanvasCssWidth = hidefCanvasWidth;
                var hidefCanvasCssHeight = hidefCanvasHeight;
 
                $(hidefCanvas).attr('width', hidefCanvasWidth * window.devicePixelRatio);
                $(hidefCanvas).attr('height', hidefCanvasHeight * window.devicePixelRatio);
                $(hidefCanvas).css('width', hidefCanvasCssWidth);
                $(hidefCanvas).css('height', hidefCanvasCssHeight);
                hidefContext.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            
            // Initiating the timeline, sending the optional width and height values
            timeline = new Timeline(records, ct, canvas, this.options.cWidth, this.options.cHeight);
            
            // Drawing the timeline
            timeline.draw();

            return records;
        }
     
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( this, options );
        });
    };
    
    /**
     * A Record constructor, for creating record objects 
     */
    function Record(date, title, desc) {
        this.dateRaw    = date              || '2000-01-01';
        this.date       = new Date(date)    || new Date(946684800000); // Default date 2000-01-01 if incoming date is empty
        this.title      = title             || ""; 
        this.desc       = desc              || "";  
    }
    Record.prototype.setDate = function(date) {
        this.date = new Date(date);
    }; 
    Record.prototype.setTitle = function(title) {
        this.title = title; 
    };    
    Record.prototype.setDesc = function(desc) {
        this.desc = desc;
    };   
    Record.prototype.concDesc = function(desc) {
        this.desc += desc;
    };   
    Record.prototype.getDateRaw = function() {
        return this.dateRaw;
    };
    Record.prototype.createDiv = function(px) {
        // Creating a div for the record, 'px' amount of pixles from the top
        $( "<div>" + 
            "<div class='timeline-title-bar'>" +
                "<div class='timeline-title'>" + this.title + "</div>" + 
                "<div class='timeline-date timeline-hidden'>" + this.dateRaw + "</div>" +
                "<div class='timeline-triangle timeline-down'></div>" +
            "</div>" + 
            "<div class='timeline-desc timeline-hidden'>" + this.desc + "</div>" +
            "</div>" ).addClass('timeline-record').css({
            'position' : 'absolute',
            'top' : px + 'px',
            'left' : '125px'                   // TODO Hard coded, should be improved
        }).appendTo($( "#timeline-wrapper" ));
    };
    
    /**
     * A Records constructor, an object containing all the records 
     */
    function Records() {
        this.records = []; 
    }
    // Adds a new record in the array records
    Records.prototype.addRecord = function(record){
        this.records.push(record); 
    };
    // Sets the title of the last record
    Records.prototype.setTitleLast = function(title){
        this.records[this.records.length - 1].setTitle(title); 
    };    
    // Adds description to the last record
    Records.prototype.addDescLast = function(desc){
        this.records[this.records.length - 1].concDesc(desc); 
    };
    // Sort records by date
    Records.prototype.sortByDate = function(){   
        this.records.sort(function(a, b) {
            if (a.date > b.date){
                return 1;
            } else if (a.date < b.date){
                return -1;
            }else{
                return 0;
            }
        });
    }; 
    // Returns the first record
    Records.prototype.firstRecord = function(){
        return this.records[0];
    };
    // Returns the last record
    Records.prototype.lastRecord = function(){
        return this.records[this.records.length - 1];
    };
    // Returns the time span between the first and the last record in ms
    Records.prototype.timeSpan = function(){
        return this.lastRecord().date - this.firstRecord().date;
    };      
    
    /**
     * A timeline constructor
     */
    function Timeline(records, ct, canvas, cWidth, cHeight) {
        this.records = records;
        this.first = records.firstRecord().date;
        this.last = records.lastRecord().date;
        this.timeSpan = records.timeSpan();
        
        this.ct = ct;
        this.canvas = canvas;
        this.cWidth = cWidth;
        this.verticalMargin = 11;
        this.cHeight = cHeight - 2 * this.verticalMargin;
        
    }
    // Draw the timeline on the incoming canvas
    Timeline.prototype.draw = function(){
        var ct = this.ct, timeHeadings = this.getTimeHeadings(), showEach;
        
        // Drawing the line
        ct.save();
        ct.translate(this.cWidth / 2, this.verticalMargin);
        ct.beginPath();
        ct.moveTo(0, 0);
        ct.lineTo(0, this.cHeight);
        ct.strokeStyle = 'black',
        ct.lineWidth = 5;
        ct.stroke();
        ct.restore();

        drawCircle = function (i, r) {
            var x = 0;                  // x coordinate
            var y = 0;                  // y coordinate
            var radius = r || 10;       // Arc radius
            var startAngle = 0;         // Starting point on circle
            var endAngle = Math.PI * 2; // End point on circle
            var anticlockwise = false;  // clockwise or anticlockwise  
            ct.save();
            ct.translate(timeline.cWidth / 2, timeline.verticalMargin + (timeline.cHeight) * i / (timeHeadings.length - 1));            
            ct.beginPath(); 
            ct.arc(x, y, radius, startAngle, endAngle, anticlockwise);          
            ct.fillStyle = 'white';
            ct.fill();
            ct.strokeStyle = 'black';
            ct.lineWidth = 1;
            ct.stroke();
            ct.restore();
        };
        
        drawDateText = function (i) {
            ct.save();
            ct.translate(timeline.cWidth / 2, timeline.verticalMargin + (timeline.cHeight) * i / (timeHeadings.length - 1));        
            // Font settings
            ct.font = "12px Arial";
            // Use a fill for our text
            ct.fillStyle = 'black';
            // Text alignment
            ct.textAlign = 'right';
            ct.textBaseline = "middle";
            // Draw the text
            ct.fillText(timeHeadings[i].dispFormat, -20, 0, 100);
            ct.restore(); 
        };
        
        // Determining how many large record headings to display (potential for improvement)
        showEach = Math.floor(timeHeadings.length / 10) + 1;

        // Drawing the time headings
        for (i = 0; i < timeHeadings.length; ++i) {
            if (i % showEach === 0) {
                drawCircle(i, 10);
                drawDateText(i);
            } else {
                drawCircle(i, 4);
            }
        }

        // Creating each record
        // Calculating the percentage of the record on the timeline
        // Then translating that into pixles, and drawing it with the .createDiv() method
        timelineInMs = timeHeadings[timeHeadings.length - 1].dateFormat.valueOf() - timeHeadings[0].dateFormat.valueOf();

        for (i = 0; i < this.records.records.length; ++i) {

            var inPercent = (this.records.records[i].date.valueOf() - timeHeadings[0].dateFormat.valueOf() ) / timelineInMs;
            var inPixles = inPercent * timeline.cHeight;
    
            this.records.records[i].createDiv(timeline.verticalMargin + inPixles);
        }

    };
    
    Timeline.prototype.getTimeHeadings = function(){
        var inSeconds = this.timeSpan / 1000, 
            inMinutes = inSeconds / 60, 
            inHours = inMinutes / 60, 
            inDays = inHours / 24, 
            inMonths = inDays / 31,     // Not exact since months vary in days, but good enough
            inYears = inDays / 365,
            res = []
            ;
        
        if ( inYears > 1) {             // Time span in years
            for (i = this.first.getFullYear(); i <= this.last.getFullYear() + 1; ++i){
                res.push({dispFormat : i, dateFormat : new Date(i + "-01-01")});
            }
        } else if ( inMonths > 1 ) {    // Time span in months
        
            // Function to "add" a month to a date, rounding up the date to the first of the next month. Returns date.
            ceilMonth = function(date) {
                var  mo = date.getMonth() + 1,  // getMonth() returns 0-11
                     yr = date.getFullYear();
                if (mo !== 12){
                    mo += 1;
                } else {
                    mo = 1;
                    yr += 1;
                }
                return new Date(yr + "-" + ("0" + mo).slice(-2) + "-01");   // slice manouver to get the month in double digits 
            };
            
            activeDate = new Date(this.first.getFullYear() + "-" + ("0" + (this.first.getMonth() + 1)).slice(-2) + "-01");
            lastDate = ceilMonth(this.last);

            for ( i = activeDate; i.getTime() <= lastDate.getTime(); i = ceilMonth(i) ) {
                res.push({dispFormat : activeDate.toUTCString().slice(8,16), dateFormat : activeDate});
                activeDate = ceilMonth(activeDate);
            }

        } else if ( inDays > 1 ) {      // Time span in days
            for (i = this.first.getTime(); i < this.last.getTime() + 1000 * 60 * 60 * 24; i += 1000 * 60 * 60 * 24){
                if ( new Date(i).toISOString().slice(0,10) !== res[res.length - 1] ) {
                    res.push({dispFormat : new Date(i).toISOString().slice(0,10), dateFormat : new Date(i)});
                }
            }
        }
        
        return res;
    };
})( jQuery, window, document );