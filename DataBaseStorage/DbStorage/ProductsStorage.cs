﻿using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using DataBaseStorage.ConfigurationDb;
using DataBaseStorage.Context;
using DataBaseStorage.DbModels;
using DataBaseStorage.ResponseModels;
using DataBaseStorage.StoragesInterfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseStorage.DbStorage
{
    public class ProductsStorage : BaseStorage<Product>, IProductsActions
    {
        public ProductsStorage(DBConfig dbConfig) : base(dbConfig)
        {
        }

        public async Task<List<ProductResponse>> GetProductsWithoutDescription()
        {
            try
            {
                return await DbTable.Select(x => new ProductResponse
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Price = x.Price,
                        CurrentQuantity = x.CurrentQuantity,
                        Image = x.Image,
                        IsClothes = x.IsClothes
                    }).ToListAsync();
            }
            catch (Exception e)
            {
                throw new Exception("Невозможно получить список товаров");
            }
        }

        public async Task<List<Product>> GetSeveralProducts(List<long> ids)
        {
            try
            {
                var result = new List<Product>();
                foreach (var id in ids)
                {
                    var product = await SearchByIdAsync(id);
                    result.Add(product);
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception($"Не удалось найти выбранные товары {e}");
            }
        }

        public async Task<long> ReduceProductQuantity(long id, long quantity)
        {
            try
            {
                var product = await SearchByIdAsync(id);
                if (product.CurrentQuantity < quantity)
                    throw new ArgumentException($"Недостаточно товара в наличии");
                product.CurrentQuantity -= quantity;
                await UpdateAsync(product);
                return product.CurrentQuantity;
            }
            catch (Exception e)
            {
                throw new Exception($"{e}");
            }
        }
        
        public async Task<long> IncreaseProductQuantity(long id, long quantity)
        {
            try
            {
                var product = await SearchByIdAsync(id);
                product.CurrentQuantity += quantity;
                await UpdateAsync(product);
                return product.CurrentQuantity;
            }
            catch (Exception e)
            {
                throw new Exception($"{e}");
            }
        }
    }
}