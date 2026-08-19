export const listingStatusLabels = {
    draft: 'Черновик', moderation: 'На модерации', published: 'Опубликовано',
    rejected: 'Отклонено', unpublished: 'Снято с публикации',
};

export const viewingStatusLabels = {
    created: 'Создана', 'pending approval': 'Ждёт согласования',
    approved: 'Согласована', rejected: 'Отклонена', closed: 'Закрыта',
};

export const navItems = [
    { id: 'queue', title: 'Очередь модерации', path: '/', moderatorOnly: true },
    { id: 'listings', title: 'Все объявления', path: '/listings', moderatorOnly: true },
    { id: 'viewings', title: 'Заявки на просмотр', path: '/viewings', moderatorOnly: true },
    { id: 'districts', title: 'Районы', path: '/districts', moderatorOnly: true },
];

export const emptyListingFilters = {
    dealType: '', propertyType: '', districtId: '',
    priceMin: '', priceMax: '', rooms: [],
    search: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1, limit: 20,
};

export const emptyViewingFilters = { status: '', sortOrder: 'desc', page: 1, limit: 20 };

export const dealTypeLabels = {
    sale: 'Продажа',
    rent: 'Аренда',
};

export const propertyTypeLabels = {
    flat: 'Квартира',
    house: 'Дом',
    room: 'Комната',
    commercial: 'Коммерческая',
};