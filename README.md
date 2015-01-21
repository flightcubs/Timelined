![Timelined logo](/dev/timelined-logo.png?raw=true "Timelined-logo")

**Timelined – a jQuery timeline plugin**

## Introduction
Timelined is a ridiculously easy tool to create and visualize a timeline of given events on your web page. Just write plain text in your html-document in a predetermined way, and the plugin will fix the rest. 

## Usage
Write plain text in your HTML-document in an element with any id. This is how the input should look like:

```
[date]
[title]
[description]
```

As an example, one entry would look like this:

```
2008-11-04
Obama wins U.S. election
Democratic Senator Barack Obama was elected as the first black president of the United States. 
```

In your javascript file, call the jQuery plugin on the relevant html element like this:

```
$( "#html-id" ).timelined(); 
```

That's it!

## Options
There are one option available at the moment: change the height of the timeline. The default value is 500 px. To change the height, include a numerical value for cHeight in the plugin call. Below is an example calling the function to set the height to 1000 px: 
```
$( "#html-id" ).timelined( {cHeight : 1000} ); 
 ```
 
## Installation
This plugin requires:
- jQuery 
- Javascript v1.6 or above.

To install and use this plugin, include the following files from this repo:
- jquery.timelined.js
- timelined.css to your project.

## Limitations / improvements
- The plugin uses HTML5 canvas and will not render in certain browsers. 
- The timeline is only available in Horizontal version
- Only one style of timeline available
- Events close together in time are displayed on top of each other
- Large time spans makes the timeline markers look untidy
- Possible to implement categories in different colors and pictures
- Make timeline width adjustable

Code wise:
- Improve date handling
- Use of constructor functions

## License
This software is free software and carries a MIT license.
