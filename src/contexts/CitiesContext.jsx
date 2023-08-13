import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const BASEURL = "http://localhost:9000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setisLoading(true);
        const res = await fetch(`${BASEURL}/cities`);
        const data = await res.json();
        console.log(data);
        setCities(data);
      } catch (error) {
        alert("there was an error");
      } finally {
        setisLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setisLoading(true);
      const res = await fetch(`${BASEURL}/cities/${id}`);
      const data = await res.json();
      console.log(data);
      setCurrentCity(data);
    } catch (error) {
      alert("There was an error loading data");
    } finally {
      setisLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setisLoading(true);
      const res = await fetch(`${BASEURL}/cities`, {
        method: "Post",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch (error) {
      alert("There was an error creating city");
    } finally {
      setisLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setisLoading(true);
      await fetch(`${BASEURL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      alert("there was an error deleting city");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
