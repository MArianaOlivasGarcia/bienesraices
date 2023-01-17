/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapHome.js":
/*!***************************!*\
  !*** ./src/js/mapHome.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n\n    const lat = 20.67444163271174;\n    const lng = -103.38739216304566;\n\n    const mapa = L.map('mapaInicio').setView([lat, lng], 13);\n\n\n    let markers = new L.FeatureGroup().addTo(mapa);\n\n    let properties = [];\n\n\n    // FILTERS\n\n    const filters = {\n        category: '',\n        price: ''\n    }\n\n\n    const categorySelected = document.querySelector('#inputCategories');\n    const priceSelected = document.querySelector('#inputPrice');\n\n    categorySelected.addEventListener('change', ( e ) => {\n        filters.category = +e.target.value;\n        filterProperties();\n    })\n\n    priceSelected.addEventListener('change', ( e ) => {\n        filters.price = +e.target.value;\n        filterProperties();\n    })\n\n    // END FILTERS\n\n\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n\n\n    const getProperties = async() => {\n\n        try {\n            \n            const resp = await fetch('/api/properties');\n            const data = await resp.json();\n\n            properties = data.properties;\n\n            showProperties( properties );\n\n        } catch (error) {\n            console.log(error)\n        }\n\n    }   \n\n\n    const showProperties = ( properties ) => {\n\n        // Limpiar marcadores anteriores\n        markers.clearLayers();\n\n        properties.forEach( property => {\n\n            const marker = new L.marker([property?.lat, property?.lng], {\n                autoPan: true\n            }).addTo(mapa).bindPopup(`\n                <p class=\"text-indigo-600 font-bold\">${ property.category.title }</p>\n                <h1 class=\"text-lg font-extrabold uppercase my-2\">${ property.title }</h1>\n                <img src=\"/uploads/${property.image}\" alt=\"${property.title}\" />\n                <p class=\"text-gray-600 font-bold\">${property.price.title}</p>\n                <a href=\"/property/details/${property.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver Propiedad</a>\n            `)\n\n            markers.addLayer(marker);\n\n        });\n\n    }\n\n    const filterProperties = () => {\n        const propertiesFilters = properties\n            .filter( property => {\n                return filters.category ? property.category.id == filters.category : property;\n            })\n            .filter( property => {\n                return filters.price ? property.price.id == filters.price : property;\n            })  \n        \n        showProperties(propertiesFilters)\n    }\n         \n\n    \n    getProperties();\n\n\n})()\n\n//# sourceURL=webpack://bienesraices/./src/js/mapHome.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapHome.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;