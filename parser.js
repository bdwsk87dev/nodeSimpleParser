const axios = require('axios');
const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const exceljs = require("exceljs");

const baseUrl = "https://www.mantoshop.pl";
const categoryUrl = 'https://www.mantoshop.pl/';

start();

async function start() {

    /** Find all categories */
    let categories = [];
    try {
        categories = await getCategories();
    } catch (error) {
        console.log(error);
    }
    console.log(categories);
    if (categories.length === 0) {
        console.log('Не могу найти категории');
        return false;
    }

    /** Start parsing */


    categories = categories.slice(0, 2);
    categories.forEach(url => {
        parseCategory(url);
    })

    // excelExport();
}

async function parseCategory(url) {
    /** Find last page number */
    console.log('parsing category url :' + url);
    let lastPage = parseInt(await getlastPageNum(url));
    console.log(`Last page number in this category : ${lastPage}`);

    if (lastPage > 0) {
        lastPage -= 1;
    }

    for (let currentPage = 0; currentPage <= lastPage; currentPage++) {
        const preparedUrl = (currentPage === 0) ? url : `${url}?counter=${currentPage}`;
        console.log(`prepared url : ${preparedUrl}`);
        const products = await parseProductList(preparedUrl);
        console.log('products list : ' + products);

        products.forEach(url=>{
            parseProduct(url);
        });

    }
}


async function parseProduct(url){
    console.log(url);
}


async function parseProductList(url) {
    const dom = await get(url);
    let result = [];
    const products = dom.querySelectorAll('.product a');
    products.forEach(item => {
        result.push(item.href);
    })
    return result;
}


async function getCategories() {
    const dom = await get(categoryUrl);
    let result = [];
    const menuItems = dom.querySelectorAll('.navbar-subnav a');
    menuItems.forEach(item => {
        result.push(baseUrl + item.href);
    })
    return result;
}

async function getlastPageNum(url) {
    const dom = await get(url);
    const lastPage = dom.querySelectorAll('#paging_setting_top ul.pagination li.pagination__element.--item').length;
    return parseInt(lastPage);
}

async function get(url) {
    return await axios.get(url).then(response => {
        let currentPage = response.data;
        const dom = new JSDOM(currentPage);
        return dom.window.document;
    })
}

function excelExport() {

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Alex';
    workbook.calcProperties.fullCalcOnLoad = true;

    /** Add worksheet */
    const worksheet = workbook.addWorksheet('Export Products Sheet _ Template', {
        headerFooter: {firstHeader: "Hello header", firstFooter: "Hello footer"}
    });

    /** Set up excel collumns */
    worksheet.columns = [
        {header: 'Код_товара', key: 'id1', width: 10},
        {header: 'Код_товара', key: 'id2', width: 10},
        {header: 'Название_позиции_pl', key: 'name_pl', width: 15},
        {header: 'Название_позиции', key: 'name_ru', width: 20},
        {header: 'Название_позиции_укр', key: 'name_uk', width: 20},
        {header: 'Поисковые_запросы', key: 'unsigned1', width: 3},
        {header: 'Поисковые_запросы_укр', key: 'unsigned2', width: 3},
        {header: 'Описание_pl', key: 'description_pl', width: 14},
        {header: 'Описание', key: 'description', width: 14},
        {header: 'Описание_укр', key: 'description_uk', width: 14},
        {header: 'Тип_товара', key: 'type', width: 12},
        {header: 'Цена', key: 'price', width: 10},
        {header: 'Валюта', key: 'currency', width: 10},
        {header: 'Единица_измерения', key: 'unit', width: 3},
        {header: 'Минимальный_объем_заказа', key: 'unsigned4', width: 3},
        {header: 'Оптовая_цена', key: 'unsigned5', width: 3},
        {header: 'Минимальный_заказ_опт', key: 'unsigned6', width: 3},
        {header: 'Ссылка_изображения', key: 'images', width: 4},
        {header: 'Наличие', key: 'availability', width: 32},
        {header: 'Количество', key: 'unsigned36', width: 4},
        {header: 'Номер_группы', key: 'unsigned36', width: 4},
        {header: 'Название_группы', key: 'unsigned36', width: 4},
        {header: 'Адрес_подраздела', key: 'unsigned36', width: 4},
        {header: 'Возможность_поставки', key: 'unsigned36', width: 4},
        {header: 'Срок_поставки', key: 'unsigned36', width: 4},
        {header: 'Способ_упаковки', key: 'unsigned36', width: 4},
        {header: 'Способ_упаковки_укр', key: 'unsigned36', width: 4},
        {header: 'Уникальный_идентификатор', key: 'uid', width: 32},
        {header: 'Идентификатор_товара', key: 'unsigned36', width: 32},
        {header: 'Идентификатор_подраздела', key: 'unsigned37', width: 32},
        {header: 'Идентификатор_группы', key: 'group_id', width: 32},
        {header: 'Производитель', key: 'unsigned7', width: 32},
        {header: 'Страна_производитель', key: 'unsigned8', width: 32},
        {header: 'Скидка', key: 'unsigned9', width: 32},
        {header: 'ID_группы_разновидностей', key: 'unsigned10', width: 32},
        {header: 'Личные_заметки', key: 'unsigned11', width: 32},
        {header: 'Продукт_на_сайте', key: 'unsigned12', width: 32},
        {header: 'Cрок действия скидки от', key: 'unsigned14', width: 32},
        {header: 'Cрок действия скидки до', key: 'unsigned15', width: 32},
        {header: 'Цена от', key: 'unsigned16', width: 32},
        {header: 'Ярлык', key: 'unsigned17', width: 32},
        {header: 'HTML_заголовок', key: 'unsigned18', width: 32},
        {header: 'HTML_заголовок_укр', key: 'unsigned19', width: 32},
        {header: 'HTML_описание', key: 'unsigned20', width: 32},
        {header: 'HTML_описание_укр', key: 'unsigned21', width: 32},
        {header: 'HTML_ключевые_слова', key: 'unsigned22', width: 32},
        {header: 'HTML_ключевые_слова_укр', key: 'unsigned23', width: 32},
        {header: 'Вес,кг', key: 'unsigned24', width: 32},
        {header: 'Ширина,см', key: 'unsigned25', width: 32},
        {header: 'Высота,см', key: 'unsigned26', width: 32},
        {header: 'Длина,см', key: 'unsigned27', width: 32},
        {header: 'Где_находится_товар', key: 'unsigned28', width: 32},
        {header: 'Код_маркировки_(GTIN)', key: 'unsigned29', width: 32},
        {header: 'Номер_устройства_(MPN)', key: 'unsigned30', width: 32},
        {header: 'Название_Характеристики', key: 'unsigned31', width: 32},
        {header: 'Измерение_Характеристики', key: 'unsigned32', width: 32},
        {header: 'Значение_Характеристики', key: 'unsigned33', width: 32},
        {header: 'Название_Характеристики', key: 'unsigned34', width: 32},
        {header: 'Измерение_Характеристики', key: 'unsigned35', width: 32},
        {header: 'Значение_Характеристики', key: 'unsigned36', width: 32},
        {header: 'Название_Характеристики', key: 'unsigned37', width: 32},
        {header: 'Измерение_Характеристики', key: 'unsigned38', width: 32},
        {header: 'Значение_Характеристики', key: 'unsigned39', width: 32},
    ];

    // productsResult.forEach(data => {
    //     worksheet.addRow(data);
    // });


    /**
     * SECOND PAGE
     */

    const worksheetGroups = workbook.addWorksheet('Export Groups Sheet _ Template', {
        headerFooter: {firstHeader: "Hello header", firstFooter: "Hello footer"}
    });

    /** Set up excel collumns */
    worksheetGroups.columns = [
        {header: 'Номер_группы', key: 'group_num', width: 10},
        {header: 'Название_группы_pl', key: 'group_name_pl', width: 15},
        {header: 'Название_группы', key: 'group_name_ru', width: 15},
        {header: 'Название_группы_укр', key: 'group_name_uk', width: 15},
        {header: 'Идентификатор_группы', key: 'group_id', width: 20},
        {header: 'Номер_родителя', key: 'parent_num', width: 20},
        {header: 'Идентификатор_родителя', key: 'parent_id', width: 20},
        {header: 'HTML_заголовок_группы', key: 'unsigned40', width: 20},
        {header: 'HTML_заголовок_группы_укр', key: 'unsigned41', width: 20},
        {header: 'HTML_описание_группы', key: 'unsigned42', width: 20},
        {header: 'HTML_описание_группы_укр', key: 'unsigned43', width: 20},
        {header: 'HTML_ключевые_слова_группы', key: 'unsigned44', width: 20},
        {header: 'HTML_ключевые_слова_группы_укр', key: 'unsigned45', width: 20},
    ];

    // groupResult.forEach(group => {
    //     worksheetGroups.addRow(group);
    // });

    /** Call the download excel method */
    downloadExcel(workbook);
}

/** Download excel method */
async function downloadExcel(workbook) {
    await workbook.xlsx.writeFile('Parsed.xlsx');
}


// https://skillbox.ru/media/code/kak-parsit-sayty-i-materialy-smi-s-pomoshchyu-javascript-i-nodejs/

// https://www.npmjs.com/package/exceljs