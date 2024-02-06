/**
 * @param datas - list of data
 * @param createdData - an exemple of createdData
 * @param key - key of the model that you wanna create
 * @returns a Prisma mocker for a model
 */
export const createPrismaMocker = (
    datas: any[],
    createdData,
    key: string,
): any => {
    const prismaMock = {};
    const ret = {
        create: jest.fn(() => createdData),
        delete: jest.fn((params) =>
            datas.find((data) => data.id === params.where.id),
        ),
        findUnique: jest.fn((params) =>
            datas.find((data) => {
                const { where } = params;
                const keys = Object.keys(where);
                return keys.every((key) => data[key] === where[key]);
            }),
        ),
        findMany: jest.fn((params) => {
            if (params) {
                return (
                    datas.filter((data) => {
                        const { where } = params;
                        const keys = Object.keys(where);
                        return keys.every((key) => data[key] === where[key]);
                    }) || []
                );
            } else {
                return datas;
            }
        }),
        update: jest.fn((params) => {
            const { where, data } = params;
            const response = datas.find((data) => data.id === where.id);
            if (response) {
                return {
                    ...response,
                    ...data,
                };
            } else {
                return null;
            }
        }),
    };
    prismaMock[key] = ret;
    prismaMock["mockClear"] = function () {
        prismaMock[key].create.mockClear();
        prismaMock[key].update.mockClear();
        prismaMock[key].delete.mockClear();
        prismaMock[key].findUnique.mockClear();
        prismaMock[key].findMany.mockClear();
    };
    return prismaMock;
};
