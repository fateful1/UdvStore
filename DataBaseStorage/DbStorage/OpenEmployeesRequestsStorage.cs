﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataBaseStorage.ConfigurationDb;
using DataBaseStorage.Context;
using DataBaseStorage.DbModels;
using DataBaseStorage.Enums;
using DataBaseStorage.StoragesInterfaces;
using Microsoft.EntityFrameworkCore;

namespace DataBaseStorage.DbStorage
{
    public class OpenEmployeesRequestsStorage : BaseStorage<OpenEmployeesRequest>, IForUserHistory<OpenEmployeesRequest>
    {
        public OpenEmployeesRequestsStorage(DBConfig dbConfig) : base(dbConfig)
        {
        }
        
        public async Task<OpenEmployeesRequest> Add(string eventEntered, string description,
            long employeeId, DateTime eventDate)
        {
            var id = await GetLastIdAsync();
            if (await DbTable.AnyAsync() && await DbTable.AnyAsync(x => 
                    x.Event.Equals(eventEntered) &&
                    x.Description.Equals(description) &&
                    x.EmployeeId.Equals(employeeId) &&
                    x.EventDate.Equals(eventDate)))
                throw new Exception("Запись уже существует в базе данных");
            try
            {
                var request = new OpenEmployeesRequest
                {
                    Id = id + 1,
                    Description = description,
                    Event = eventEntered,
                    EmployeeId = employeeId,
                    EventDate = eventDate,
                    TimeSent = DateTime.Now
                };
                DbTable.Add(request);
                await SaveChangesAsync();
                return request;
            }
            catch (Exception e)
            {
                throw new Exception($"Не получилось создать заявку {e}");
            }
        }
        
        public async Task<List<OpenEmployeesRequest>> GetAll()
        {
            var requests = await DbTable.ToListAsync();
            requests.Sort((x, y) => DateTime.Compare(y.TimeSent, x.TimeSent));
            return requests;
        }
        
        public async Task<List<OpenEmployeesRequest>> GetEmployeeHistory(long employeeId)
        {
            return await DbTable.Where(x => x.EmployeeId.Equals(employeeId)).ToListAsync();
        }
    }
}