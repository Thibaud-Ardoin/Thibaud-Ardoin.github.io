## Background 📚

In previous work we show that Internal representations of LLMs are pretty good at distinguishing Human text from LLM generated content [2].

More precisely in [2] we demonstrated the effectiveness of a new paradigm of watermarking, but a broader comparison could be done to place this method among the other known methods. 
To improve our method, two other tracks could be followed:
1. Select steering vectors with good trade-off
2. Use a better extractor

In an other work, we showed that a weighted sum is a good way to extract a clearer representation of a sequence of LLM activations [1].

```
    🔬 Can we improve Self-Recogntion or AI-GTD with the use of a WMLP ?
```


## Goal 🎯

Test AI-GTD in LLM internal represenation enhanced at extraction of the representation by a well trained weighted sum (WMLP)!


## References

[1] *Prompt Compression via Activation Aggregation* Ardoin, et. al (2026) Under review. https://arxiv.org/abs/2607.08399

[2] *LLM Self-Recognition: Steering and Retrieving Activation Signatures* Ardoin, et. al (2026) ICML'26: https://arxiv.org/abs/2606.06315
