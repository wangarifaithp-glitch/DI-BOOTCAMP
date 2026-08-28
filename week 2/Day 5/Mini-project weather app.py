# weather_gui.py
#
# BONUS Mini Project (XP Ninja):
#   A weather GUI showing the 3-day humidity forecast for a city, as a
#   styled bar chart, built with Matplotlib (which uses Tkinter behind
#   the scenes to pop up the window).

from collections import defaultdict
from datetime import datetime
from datetime import timezone
import os

try:
    import matplotlib.pyplot as plt
    from pyowm.owm import OWM
except ModuleNotFoundError as error:
    raise SystemExit(
        "Missing dependency. Install packages with: "
        "pip install matplotlib pyowm"
    ) from error

API_KEY = os.getenv("OPENWEATHER_API_KEY")

CITY = "Paris,FR"  # <-- change this to any city you like


def get_three_day_humidity(city):
    """
    Fetch the 3-hour interval forecast for `city` and group the humidity
    readings by calendar day. Returns two parallel lists:
      - dates: the 3 nearest calendar days (as strings, e.g. 'Mon 25')
      - humidities: the average humidity (%) for each of those days
    """
    if not API_KEY:
        raise RuntimeError(
            "Missing OpenWeather API key. Set the OPENWEATHER_API_KEY "
            "environment variable before running the app."
        )

    owm = OWM(API_KEY)
    mgr = owm.weather_manager()
    forecast = mgr.forecast_at_place(city, "3h").forecast

    # Group every 3-hour reading's humidity value by the day it falls on
    humidity_by_day = defaultdict(list)

    for weather in forecast:
        # reference_time gives a UTC datetime; convert to a plain date label
        dt_utc = weather.reference_time("date")  # datetime.datetime, tz-aware UTC
        dt_local = dt_utc.astimezone(timezone.utc)
        day_label = dt_local.strftime("%a %d")  # e.g. "Mon 25"
        humidity_by_day[day_label].append(weather.humidity)

    # Keep the first 3 distinct days found in the forecast, in order
    days_in_order = list(humidity_by_day.keys())[:3]

    dates = []
    humidities = []
    for day in days_in_order:
        readings = humidity_by_day[day]
        average_humidity = sum(readings) / len(readings)
        dates.append(day)
        humidities.append(round(average_humidity, 1))

    return dates, humidities


def init_plot(ax, city):
    """
    Set up the static parts of the chart: axis label and title.
    Called once, before the bars are drawn.
    """
    ax.set_ylabel("Humidity (%)", fontsize=12, fontweight="bold")
    ax.set_title(f"3-Day Humidity Forecast — {city}", fontsize=14, fontweight="bold")
    ax.set_ylim(0, 100)  # humidity is always a percentage, 0-100


def plot_temperatures(ax, dates, humidities):
    """
    Draw the bars themselves: one bar per day, with the humidity
    percentage as the bar's height.
    (Named plot_temperatures per the assignment spec — here it plots
    the humidity bars.)
    Returns the bar container so we can label each bar afterward.
    """
    colors = ["#4FC3F7", "#29B6F6", "#0288D1"]  # light-to-dark blue gradient
    bars = ax.bar(dates, humidities, color=colors[:len(dates)], width=0.5, edgecolor="black")
    return bars


def write_humidity_on_bar_chart(ax, bars, humidities):
    """
    Write the % humidity value on top of each bar so it's easy to
    read at a glance.
    """
    for bar, humidity in zip(bars, humidities):
        height = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width() / 2,  # centered horizontally on the bar
            height + 2,                          # a little above the bar
            f"{humidity}%",
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold"
        )


def style_chart(ax):
    """Apply some extra visual styling to make the chart look polished."""
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.yaxis.grid(True, linestyle="--", alpha=0.5)
    ax.set_axisbelow(True)  # keep gridlines behind the bars
    ax.tick_params(axis="both", labelsize=11)


def show_humidity_chart(city=CITY):
    """Build and display the full 3-day humidity bar chart for `city`."""
    dates, humidities = get_three_day_humidity(city)

    fig, ax = plt.subplots(figsize=(8, 5))

    init_plot(ax, city)
    bars = plot_temperatures(ax, dates, humidities)
    write_humidity_on_bar_chart(ax, bars, humidities)
    style_chart(ax)

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    try:
        show_humidity_chart()
    except RuntimeError as error:
        print(f"Error: {error}")