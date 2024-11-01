export const filterCourses = (category, level, primaryLanguage) => {
    let filters = {};

    if (category.length) filters.category = { $in: category.split(',') };
    if (level.length) filters.level = { $in: level.split(',') };
    if (primaryLanguage.length) filters.primaryLanguage = { $in: primaryLanguage.split(',') };

    return filters;
}

export const sortByFiltering = (sortBy) => {

    let sortParam = {};

    switch (sortBy) {
        case "price-lowtohigh":
            sortParam.pricing = 1;
            break;

        case "price-hightolow":
            sortParam.pricing = -1;
            break;

        case "title-atoz":
            sortParam.title = 1;
            break;

        case "title-ztoa":
            sortParam.title = -1;
            break;

        default:
            sortParam.pricing = 1;
            break;
    }

    return sortParam;
}