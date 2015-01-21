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

## Screenshot
A timeline could look like this:

![Timelined logo](/dev/screenshot01.png?raw=true "Timelined-logo")

## Minimal example

Minimal working example can be found here: http://jsfiddle.net/flightcubs/yztxjumj/2/

Include the following in your HTML: 
```
<p id='timelined'>
1939-09-01
Hitler invades Poland
Hitler invades Poland on 1 September. Britain and France declare war on Germany two days later.

1940-01-01
Blitzkrieg and Churchill
German 'Blitzkrieg' overwhelms Belgium, Holland and France. Churchill becomes Prime Minister of Britain.

1941-01-01
Barbarossa and Pearl Harbor
Hitler begins Operation Barbarossa - the invasion of Russia. The Blitz continues against Britain's major cities. Japan attacks Pearl Harbor, and the US enters the war.

1942-01-01
Stalingrad, El Alamein, Auschwitz 
Germany suffers setbacks at Stalingrad and El Alamein. Mass murder of Jewish people at Auschwitz begins.

1943-01-01
Italy surrenders
Surrender at Stalingrad marks Germany's first major defeat. Allied victory in North Africa enables invasion of Italy to be launched. Italy surrenders, but Germany takes over the battle.

1944-01-01
D-day
Allies land at Anzio and bomb monastery at Monte Cassino. Soviet offensive gathers pace in Eastern Europe. D Day: The Allied invasion of France. Paris is liberated in August. Guam liberated by the US Okinawa, and Iwo Jima bombed.

1945-01-01
Germany surrenders, atomic bombs are dropped
Auschwitz liberated by Soviet troops. Russians reach Berlin: Hitler commits suicide and Germany surrenders on 7 May. Truman becomes President of the US on Roosevelt's death, and Attlee replaces Churchill.
After atomic bombs are dropped on Hiroshima and Nagasaki, Japan surrenders on 14 August.
</p>
```

And include the following in your javascript file
```
$( "#timelined" ).timelined();
```

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
