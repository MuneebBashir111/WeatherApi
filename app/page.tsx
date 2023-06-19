"use client";

import React from "react";
import { EnvironmentOutlined } from "@ant-design/icons";
import styles from "./page.module.css";
import { AutoComplete, Input, Divider } from "antd";
import cities from "./lib/cities.json";
import moment from "moment-timezone";
import { useLazyGetWeatherQuery } from "@/redux/weather/weatherApi";

interface IResult {
  value: string;
  label: string;
}

export default function Home() {
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<IResult[]>([]);
  const [getWeatherReport, { data, isLoading, error }] =
    useLazyGetWeatherQuery<any>();
  const handleSearch = (value: string) => {
    setQuery(value);
    const citiesList: any = cities;
    let matchingCities: IResult[] = [];
    if (value.length > 3) {
      for (let city of citiesList) {
        if (matchingCities.length >= 5) {
          break;
        }
        const match = city.name.toLowerCase().startsWith(value.toLowerCase());
        if (match) {
          const cityData = {
            ...city,
            value: `${city.name.toLowerCase().replace(/ /g, "-")}-${city.id}`,
            label: city.name + "," + city.state + "(" + city.country + ")",
          };
          matchingCities.push(cityData);
        }
      }
    }
    return setResults(matchingCities);
  };

  const handleSelect = (value: string, city: any) => {
    const label: string =
      city.name + "," + city.state + "(" + city.country + ")";
    setQuery(label);
    getWeatherReport(city);
  };
  const getFirstLetterUpperCase = (text: string) => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
  };
  return (
    <main className={styles.main}>
      <div>
        <AutoComplete
          style={{ width: 600 }}
          onSearch={handleSearch}
          onSelect={handleSelect}
          value={query}
          options={results}
        >
          <Input
            placeholder="Search"
            prefix={<EnvironmentOutlined style={{ color: "#d9d9d9" }} />}
          />
        </AutoComplete>
      </div>
      {data ? (
        <div className={styles.weather_report}>
          <div className={styles.left}>
            <h2>{data.name}</h2>
            <h1 className={styles.temp}>{data.main.temp}°</h1>
            <Divider />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3>{getFirstLetterUpperCase(data.weather[0].description)}</h3>
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                height="150"
                width="auto"
              />
            </div>
            <h6>Weather in {data.name} Today</h6>
            <h1>{data.main.feels_like}°</h1>
            <small>Feels like</small>
            <Divider />
            <div style={{ display: "flex" }}>
              <div className={styles.left}>
                <p>
                  <span>High/Low</span>
                  <span style={{ float: "right" }}>
                    {data.main.temp_max}°/{data.main.temp_min}°
                  </span>
                </p>
                <p style={{ marginTop: "1rem" }}>
                  <span>Humdity</span>
                  <span style={{ float: "right" }}>{data.main.humidity}%</span>
                </p>
              </div>
              <div className={styles.right}>
                <p>
                  <span>Pressure</span>
                  <span style={{ float: "right" }}>
                    {data.main.pressure}hPa
                  </span>
                </p>
                <p style={{ marginTop: "1rem" }}>
                  <span>Visibility</span>
                  <span style={{ float: "right" }}>{data.visibility}m</span>
                </p>
              </div>
            </div>
          </div>
          <div className={`${styles.right} ${styles.center}`}>
            <div>
              <h1>Sunrise</h1>
              <h2 style={{ textAlign: "center" }}>
                {moment
                  .unix(data.sys.sunrise + data.timezone)
                  .tz("UTC")
                  .format("LT")}
              </h2>
            </div>
            <div>
              <h1>Sunset</h1>
              <h2 style={{ textAlign: "center" }}>
                {moment
                  .unix(data.sys.sunset + data.timezone)
                  .tz("UTC")
                  .format("LT")}
              </h2>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
