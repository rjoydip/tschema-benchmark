# validation-library-benchmark

This repo contains the benchmarking results of all data validation library.

## Benchmark

Generate benchmark results using below command.

```sh
deno bench
```

## Benchmark results

Format codebase using below command.

```sh
deno fmt
```

## Benchmark results

```sh
cpu: Intel(R) Core(TM) i3-8145U CPU @ 2.10GHz
runtime: deno 1.45.5 (x86_64-pc-windows-msvc)

file:///validation-library-benchmark/bench.ts
benchmark               time (avg)        iter/s             (min … max)       p75       p99      p995
------------------------------------------------------------------------ -----------------------------

group builder
tschema                468.86 ns/iter   2,132,846.2   (301.35 ns … 1.34 µs) 564.82 ns 879.41 ns 1.34 µs
sinclair/typebox        28.41 µs/iter      35,205.1     (15.9 µs … 2.94 ms) 31.4 µs 103.5 µs 165.5 µs
zod-to-json-schema      90.83 µs/iter      11,009.0     (40.7 µs … 3.46 ms) 91.9 µs 473.5 µs 1.41 ms
valibot                   1.3 µs/iter     768,816.3      (844 ns … 3.52 µs) 1.43 µs 3.52 µs 3.52 µs
ajv                     13.22 ms/iter          75.6    (7.39 ms … 27.22 ms) 14.05 ms 27.22 ms 27.22 ms
jsonschema              84.85 µs/iter      11,785.5     (33.3 µs … 7.37 ms) 79 µs 474.3 µs 1.55 ms
joi                    213.29 µs/iter       4,688.4    (109.3 µs … 6.82 ms) 231.5 µs 812.8 µs 1.12 ms
yup                    198.72 µs/iter       5,032.1    (59.5 µs … 14.33 ms) 147.9 µs 2.25 ms 2.72 ms

summary
  tschema
   2.77x faster than valibot
   60.58x faster than sinclair/typebox
   180.97x faster than jsonschema
   193.74x faster than zod-to-json-schema
   423.85x faster than yup
   454.92x faster than joi
   28200.43x faster than ajv
```
