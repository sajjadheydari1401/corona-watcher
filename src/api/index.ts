import axios, { AxiosResponse } from "axios";

const url = "https://covid19.mathdro.id/api";

interface CountryData {
  confirmed: number | null;
  recovered: number | null;
  deaths: number | null;
  lastUpdate: string;
}

interface DailyData {
  confirmed: number | null;
  recovered: number | null;
  deaths: number | null;
  date: string;
}

export const fetchData = async (
  country: string
): Promise<CountryData | Error> => {
  let changeableUrl = url;

  if (country) {
    changeableUrl = `${url}/countries/${country}`;
  }

  try {
    const {
      data,
    }: AxiosResponse<{
      confirmed: number | null;
      recovered: number | null;
      deaths: number | null;
      lastUpdate: string;
    }> = await axios.get(changeableUrl);

    return {
      confirmed: data.confirmed,
      recovered: data.recovered,
      deaths: data.deaths,
      lastUpdate: data.lastUpdate,
    };
  } catch (error) {
    return error as Error;
  }
};

export const fetchDailyData = async (): Promise<DailyData[] | Error> => {
  try {
    const { data }: AxiosResponse<any[]> = await axios.get(
      "https://api.covidtracking.com/v1/us/daily.json"
    );

    return data.map(
      ({
        positive,
        recovered,
        death,
        dateChecked: date,
      }: {
        positive: number | null;
        recovered: number | null;
        death: number | null;
        dateChecked: string;
      }) => ({
        confirmed: positive,
        recovered,
        deaths: death,
        date,
      })
    );
  } catch (error) {
    return error as Error;
  }
};

export const fetchCountries = async (): Promise<string[] | Error> => {
  try {
    const { data }: AxiosResponse<{ countries: { name: string }[] }> =
      await axios.get(`${url}/countries`);

    return data.countries.map((country) => country.name);
  } catch (error) {
    return error as Error;
  }
};
