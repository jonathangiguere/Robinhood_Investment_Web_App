# Robinhood_Investment_Web_App
A simple web app that shows the ten most popular stocks on Robinhood over time and allows users to drill down into historical stock information.
The tool was created with D3.js and Bootstrap.

## Motivation
This project was completed for a Data Visualization and Web Development class at The George Washington University.
I was tasked with creating a beautiful and useful web based data visualization with whatever data and tools I wanted.
I opted to use D3.js to create my visuals.  For my topic, I chose to analyze popular stocks on the Robinhood trading platform.
I chose to analyze Robinhood data because it is a platform used widely by retail investors.  The tool I created aims
to show what retail investors like to invest in and allows users to investigate the price and volume trends behind the popular stocks.

## Data Source
The data for this analysis came from Kaggle and the Robinhood API (Robin Stocks).  Refer to the Jupyter Notebooks for how this data was processed.
- Kaggle source: https://www.kaggle.com/cprimozi/robinhood-stock-popularity-history
- Robin Stocks reference: https://robin-stocks.readthedocs.io/en/latest/

## Using the Tool
The tool consists of one HTML page, one CSS file, and two JavaScript files (one for each D3.js visual).
There is a sidebar that controls the bar chart race animation and it can be toggled to be hidden.
On the top navbar, there are links to the data sources.  The line chart can be toggled to show price
and volume data for a selected ticker symbol.  Only 50 of the most popular stocks are included.  These were
the 50 most popular stocks on the platform as of 7/6/2020.  Data for the bar chart race ranges from 1/16/2020
to 7/6/2020.  Data for the line chart spans the 3 months prior to 7/6/2020.  Future work could be done to keep
data from these sources up to date but was outside the scope of this project.

## Live Site
Visit the following link to interact with the web app: https://jonathangiguere.github.io/Robinhood_Investment_Web_App/
