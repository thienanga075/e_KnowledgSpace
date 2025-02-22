﻿using KnowLedgeBackendServer.UnitTest.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KnowLedgeBackendServer.UnitTest.Extensions
{
    public static class QueryableExtensions
    {
        public static IQueryable<T> AsAsyncQueryable<T>(this IEnumerable<T> input)
        {
            return new NotInDbSet<T>(input);
        }
    }
}
